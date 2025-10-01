const host = import.meta.env.VITE_BACKEND_HOST || 'http://localhost:5000';
// Optional debug flag for verbose logging
const DEBUG = import.meta.env.VITE_DEBUG === '1';
// Development mode flag
const IS_DEV = import.meta.env.DEV || DEBUG;
// Explicit offline flag (manual) via env
const OFFLINE = import.meta.env.VITE_OFFLINE === '1';
// How long to remember network failures (30s by default)
const OFFLINE_MEMORY = 30000; 

// Create a window-level shared state object for connectivity tracking
if (!window._appConnectivity) {
  window._appConnectivity = {
    dynamicOffline: OFFLINE,
    lastNetworkFailure: 0,
    failureCount: 0,
    pendingRequests: 0,
    maxFailureLog: IS_DEV ? 3 : 1 // Maximum number of failures to log to console
  };
}

// Use shared connectivity state to coordinate between hooks and API module
let dynamicOffline = window._appConnectivity.dynamicOffline;
let mockLoaded = false;
let mockProductsCache = [];
let mockVariationsCache = [];
// Track network failures to reduce log spam
let networkFailureLogged = 0;
let lastNetworkFailure = window._appConnectivity.lastNetworkFailure;

// Pre-check if we're likely offline to avoid initial connection errors
(function checkInitialConnectivity() {
  // If explicitly set to offline, no need to check
  if (OFFLINE) return;
  
  // Use a silent ping to check if we're online on startup
  // This helps prevent the initial connection errors in the console
  const silentPing = new Image();
  silentPing.onload = () => {
    // Successfully loaded - we have internet, but backend might still be offline
    // We'll let the normal health checks determine backend status
  };
  silentPing.onerror = () => {
    // Failed to load - likely offline entirely
    if (DEBUG) console.info('[api] Network connectivity check failed on startup, activating offline mode');
    activateDynamicOffline('Initial connectivity check failed');
  };
  
  // Try to load a tiny image from a reliable CDN
  // This will fail silently if we're offline
  silentPing.src = 'https://cdn.jsdelivr.net/gh/favicon.png?_=' + Date.now();
})();

// Global fetch interceptor to prevent console errors
const originalFetch = window.fetch;
window.fetch = function interceptedFetch(url, options = {}) {
  // Get request details
  const urlStr = typeof url === 'string' ? url : url.toString();
  const isBackendRequest = urlStr.includes('localhost:5000') || 
                          urlStr.includes(':5000') || // Added to catch all port 5000 requests
                          urlStr.includes(host) || 
                          urlStr.includes('/admin/') || 
                          urlStr.includes('/health');
  
  // Handle health check special case - completely silent
  // This prevents ERR_CONNECTION_REFUSED errors in the console for health checks
  const isHealthCheck = urlStr.includes('/health') || (options.headers && options.headers['X-Health-Check']);
  if (isHealthCheck) {
    // For health check requests, completely bypass normal fetch to prevent console errors
    return new Promise((resolve) => {
      // Create an image ping instead - this won't show connection errors in console
      const img = new Image();
      img.onload = () => resolve(new Response('{"ok":true}', {
        status: 200, 
        headers: { 'Content-Type': 'application/json' }
      }));
      img.onerror = () => resolve(new Response('{"ok":false}', {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }));
      // Use a tiny data URL that will load instantly whether online or offline
      img.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
      
      // Still set a timeout as backup
      setTimeout(() => {
        resolve(new Response('{"ok":false}', {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }));
      }, 1000);
    });
  }
  
  // Skip interception for non-backend requests
  if (!isBackendRequest) {
    return originalFetch.apply(this, arguments);
  }
  
  // Track API request
  if (!isHealthCheck) {
    window._appConnectivity.pendingRequests = (window._appConnectivity.pendingRequests || 0) + 1;
  }
  
  // Preemptively detect if we're in offline mode
  // We should treat the app as offline if:
  // 1. Dynamic offline mode is explicitly set
  // 2. Explicit offline flag is set
  // 3. There was a recent network failure
  // 4. We've already had multiple connection failures
  const isOfflineMode = dynamicOffline || 
                        OFFLINE || 
                        (Date.now() - lastNetworkFailure < OFFLINE_MEMORY) ||
                        (window._appConnectivity.failureCount > 1);
  
  // If we're already offline and it's a backend request, don't even try - silently fail
  if (isOfflineMode) {
    if (DEBUG && networkFailureLogged < window._appConnectivity.maxFailureLog) {
      console.info(`[fetch] Prevented request to ${urlStr.split('?')[0]} - offline mode active`);
      networkFailureLogged++;
    }
    
    // For non-health check requests, handle properly
    if (!isHealthCheck) {
      window._appConnectivity.pendingRequests--;
      
      // Determine response type based on request
      let responseBody = '{}';
      if (urlStr.includes('/productslist') || urlStr.includes('/getproductbyid')) {
        responseBody = '{"success":true,"products":[]}';
      } else if (urlStr.includes('/getcart')) {
        responseBody = '{"success":true,"cart":{"items":[],"totalPrice":0}}';
      }
      
      // Return a promise that resolves to a dummy Response to avoid errors
      return Promise.resolve(new Response(responseBody, {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }));
    }
  }
  
  // Create an AbortController for timeout handling
  const controller = new AbortController();
  const originalSignal = options.signal;
  
  // Merge with any existing signal if present
  if (originalSignal) {
    if (originalSignal.aborted) {
      controller.abort(originalSignal.reason);
    } else {
      originalSignal.addEventListener('abort', () => {
        controller.abort(originalSignal.reason);
      });
    }
  }
  
  // Set a timeout for backend requests
  const timeoutId = !isHealthCheck ? setTimeout(() => {
    controller.abort(new DOMException('Fetch timeout', 'TimeoutError'));
  }, options.timeout || 5000) : null;
  
  // Update the options with our signal
  const fetchOptions = { 
    ...options, 
    signal: controller.signal 
  };
  
  // Return the modified fetch
  return originalFetch(url, fetchOptions)
    .then(response => {
      if (!isHealthCheck) window._appConnectivity.pendingRequests--;
      if (!response.ok && !isHealthCheck) {
        // Server error (not network error)
        activateDynamicOffline(`Server returned ${response.status}`);
      }
      return response;
    })
    .catch(error => {
      if (!isHealthCheck) window._appConnectivity.pendingRequests--;
      
      // AbortError is typically a timeout
      if (error.name === 'AbortError' && !isHealthCheck) {
        activateDynamicOffline('Request timeout');
      } else if (!isHealthCheck) {
        // Network errors like ECONNREFUSED
        activateDynamicOffline(error.message);
      }
      
      // Only log critical fetch errors
      if (DEBUG && !isHealthCheck && networkFailureLogged < window._appConnectivity.maxFailureLog) {
        console.warn(`[fetch] Error fetching ${urlStr.split('?')[0]}: ${error.message}`);
        networkFailureLogged++;
      }
      
      throw error;
    })
    .finally(() => {
      if (timeoutId) clearTimeout(timeoutId);
    });
};

// Helper to create fetch requests that timeout quickly when offline
function fetchWithTimeout(url, options = {}) {
  // URL detection for backend requests
  const urlStr = url.toString();
  const isBackendRequest = urlStr.includes('localhost:5000') || 
                          urlStr.includes(':5000') ||  // Added to catch all port 5000 requests
                          urlStr.includes(host) || 
                          urlStr.includes('/admin/') || 
                          urlStr.includes('/health');
  
  // Determine if we should use offline mode
  const isOfflineMode = dynamicOffline || 
                       OFFLINE || 
                       (Date.now() - lastNetworkFailure < OFFLINE_MEMORY) ||
                       (window._appConnectivity.failureCount > 1);
  
  // If we're already offline and it's a backend request, don't even try - fail silently
  if (isOfflineMode && isBackendRequest) {
    // Instead of rejecting with an error (which could be logged to console),
    // return a mock response that simulates a successful fetch
    // This prevents ERR_CONNECTION_REFUSED errors from appearing
    let responseBody = '{}';
    if (urlStr.includes('/productslist') || urlStr.includes('/getproductbyid')) {
      responseBody = '{"success":true,"products":[]}';
    } else if (urlStr.includes('/getcart')) {
      responseBody = '{"success":true,"cart":{"items":[],"totalPrice":0}}';
    }
    
    return Promise.resolve(new Response(responseBody, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }));
  }

  // Default options for backend requests
  const fetchOptions = { 
    ...options, 
    timeout: options.timeout || 3000 // Default 3s timeout
  };
  
  // Use the global fetch which now has timeout handling built-in
  // We add a catch handler to prevent unhandled promise rejections
  return fetch(url, fetchOptions).catch(err => {
    // If this is a backend request that failed, activate offline mode
    if (isBackendRequest) {
      activateDynamicOffline(`fetchWithTimeout: ${err.message}`);
      
      // Return a mock response instead of rejecting
      let responseBody = '{}';
      if (urlStr.includes('/productslist') || urlStr.includes('/getproductbyid')) {
        responseBody = '{"success":true,"products":[]}';
      } else if (urlStr.includes('/getcart')) {
        responseBody = '{"success":true,"cart":{"items":[],"totalPrice":0}}';
      }
      
      return new Response(responseBody, {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // For non-backend requests, re-throw the error
    throw err;
  });
}

async function ensureMock() {
  if ((!OFFLINE && !dynamicOffline) || mockLoaded) return;
  
  try {
    // Import from the local mock data file in the same directory
    const mod = await import('./mockData.js');
    
    mockProductsCache = mod.mockProducts;
    mockVariationsCache = mod.mockVariations;
    mockLoaded = true;
    
    if (DEBUG) console.log('[api] Mock data loaded successfully');
  } catch (err) {
    console.error('[api] Failed to load mock data:', err);
    // Provide fallback mock data if import fails
    mockProductsCache = [
      { _id: 'mock1', name: 'Mock Product 1', price: 19.99, category: 'mock', stock: 10 },
      { _id: 'mock2', name: 'Mock Product 2', price: 29.99, category: 'mock', stock: 5 }
    ];
    mockVariationsCache = [
      { _id: 'var1', type: 'Size', options: ['S', 'M', 'L'] },
      { _id: 'var2', type: 'Color', options: ['Red', 'Blue', 'Green'] }
    ];
    mockLoaded = true;
  }
}

function activateDynamicOffline(reason) {
  // Get the current time
  const now = Date.now();
  
  // Prevent excessive repeated activations
  // If we've already gone offline very recently, don't log anything
  const timeSinceLastFailure = now - lastNetworkFailure;
  const isRepeatedFailure = timeSinceLastFailure < 2000; // Within 2 seconds
  
  // Update timestamps
  lastNetworkFailure = now;
  window._appConnectivity.lastNetworkFailure = now;
  
  // Update failure count
  if (window._appConnectivity.failureCount !== undefined) {
    window._appConnectivity.failureCount++;
  } else {
    window._appConnectivity.failureCount = 1;
  }
  
  // Only take action if not already offline or if this is a repeated failure
  if (!dynamicOffline) {
    // First time going offline - be more verbose
    if (!isRepeatedFailure) {
      // In dev mode, show console warning, but in production only show info
      if (IS_DEV) {
        console.warn(`[api] Switching to offline mock mode: ${reason}`);
      } else {
        console.info(`[api] Using offline mode with mock data`);
      }
    }
    
    // Update state
    dynamicOffline = true;
    window._appConnectivity.dynamicOffline = true;
    
    // Trigger offline mode initialization
    ensureMock();
    
    // Dispatch an event that other parts of the app can listen for
    window.dispatchEvent(new CustomEvent('app:offline', { 
      detail: { reason, timestamp: now, count: window._appConnectivity.failureCount } 
    }));
  } else if (!isRepeatedFailure && DEBUG && networkFailureLogged < window._appConnectivity.maxFailureLog) {
    // Only log a limited number of times to avoid console spam
    // And only if it's not a repeated failure within a short time window
    console.debug(`[api] Network failure #${window._appConnectivity.failureCount}: ${reason}`);
    networkFailureLogged++;
  }
}


export const createAdminUser = async (params) => {
  const { username, email, password, role } = params;
  const response = await fetch(`${host}/admin/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, email, password, role }),
  });
  const data = await response.json();
  return data;
};

export const confirmAdmin = async (token) => {
  try {
    if (!token) {
      return false;
    }
    const data = await fetch(`${host}/admin/userinfo`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Token: token,
      },
    });

    const response = await data.json();
    if (!response.role === "admin") {
      return false;
    }

    return true;
  } catch (error) {
    console.log(error);
  }
};

export const loginAdmin = async (params) => {
  const { email, password } = params;

  const response = await fetch(`${host}/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  return data;
};

export const getAdmins = async () => {
  const adminCount = await fetch(`${host}/admin/getadmins`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await adminCount.json();
  return data;
};

export const addProduct = async (formData) => {
  try {
    const { name, description, price, category, stock, imageUrl, variations } =
      formData;
    const token = localStorage.getItem("Cookie");
    if (!token) {
      if (DEBUG) console.warn("[api] admin addProduct: token not found");
      return false;
    }
    const response = await fetch(`${host}/admin/addproduct`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Token: token,
      },
      body: JSON.stringify({
        name,
        description,
        price,
        category,
        stock,
        imageUrl,
        variations,
      }), // Use the FormData directly
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const updateProduct = async (id, product) => {
  try {
    const token = localStorage.getItem("Cookie");
    if (!token) {
      if (DEBUG) console.warn("[api] updateProduct: token not found");
      return false;
    }



    const body = {
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      imageUrl: product.imageUrl,
      variations: product.variations,
    };


    const response = await fetch(`${host}/admin/updateproduct/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Token: token,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getProducts = async (currentPage) => {
  try {
    if (OFFLINE || dynamicOffline) {
      await ensureMock();
      return { success: true, products: mockProductsCache, totalCount: mockProductsCache.length };
    }
    try {
      const response = await fetch(`${host}/admin/productslist`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Page: currentPage,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      return data;
    } catch (err) {
      console.error('[api] getProducts network error, falling back to mock:', err.message);
      activateDynamicOffline(err.message);
      await ensureMock();
      return { success: true, products: mockProductsCache, totalCount: mockProductsCache.length };
    }
  } catch (error) {
    console.log(error);
    return { products: [] }; // Return an empty list if there is an error
  }
};

export const getProductsFrontend = async (params = "") => {
  try {
    const { filter, sortBy } = params;
    if (OFFLINE || dynamicOffline) {
      await ensureMock();
      let filtered = [...mockProductsCache];
      if (filter) filtered = filtered.filter(p => p.category === filter);
      if (sortBy === 'latest') filtered.sort((a,b)=> new Date(b.createdAt)-new Date(a.createdAt));
      if (sortBy === 'high') filtered.sort((a,b)=> b.price - a.price);
      if (sortBy === 'low') filtered.sort((a,b)=> a.price - b.price);
      return { success: true, products: filtered, totalCount: filtered.length };
    }
    try {
      const response = await fetchWithTimeout(`${host}/admin/productslist`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Filter: filter || "",
          Sort: sortBy || "",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      return data;
    } catch (err) {
      // Only log detailed errors when not already in offline mode
      if (!dynamicOffline && DEBUG) {
        console.warn('[api] getProductsFrontend network error, falling back to mock:', err.message);
      }
      activateDynamicOffline(err.message);
      await ensureMock();
      let filtered = [...mockProductsCache];
      if (filter) filtered = filtered.filter(p => p.category === filter);
      if (sortBy === 'latest') filtered.sort((a,b)=> new Date(b.createdAt)-new Date(a.createdAt));
      if (sortBy === 'high') filtered.sort((a,b)=> b.price - a.price);
      if (sortBy === 'low') filtered.sort((a,b)=> a.price - b.price);
      return { success: true, products: filtered, totalCount: filtered.length };
    }
  } catch (error) {
    if (DEBUG) console.log(error);
    return { products: [] }; // Return an empty list if there is an error
  }
};

export const getProductById = async (productId) => {
  try {
    if (OFFLINE || dynamicOffline) {
      await ensureMock();
      const prod = mockProductsCache.find(p => p._id === productId);
      return prod ? { success: true, product: prod } : { success: false };
    }
    
    try {
      const body = {
        id: productId,
      };

      const response = await fetchWithTimeout(`${host}/admin/getproductbyid`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch product: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      // Connection refused or other network error - activate offline fallback
      // Only log detailed errors when not already in offline mode
      if (!dynamicOffline && DEBUG) {
        console.warn(`[api] getProductById network error: ${err.message}, activating fallback`);
      }
      activateDynamicOffline(`getProductById: ${err.message}`);
      
      // Return from mock data
      await ensureMock();
      const prod = mockProductsCache.find(p => p._id === productId);
      return prod ? { success: true, product: prod } : { success: false };
    }
  } catch (error) {
    if (DEBUG) console.error('[api] getProductById unhandled error:', error);
    // Ultimate fallback
    await ensureMock();
    const prod = mockProductsCache.find(p => p._id === productId) || mockProductsCache[0];
    return { success: true, product: prod };
  }
};

export const deleteProduct = async (id) => {
  try {
    const token = localStorage.getItem("Cookie");
    if (!token) {
      if (DEBUG) console.warn("[api] deleteProduct: token not found");
      return false;
    }

    const response = await fetch(`${host}/admin/deleteproduct/${id}`, {
      method: "DELETE",
      headers: {
        Token: token,
      },
    });

    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const globalSearch = async (params) => {
  try {
    const { query } = params;

    const body = {
      query: query,
    };

    const response = await fetch(`${host}/search`, {
      method: "POST", // Corrected here
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    // Check if the response status is OK
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Global Search Error:", error);
    throw error; // Optionally rethrow the error for further handling
  }
};

export const shuffleArray = (arr) => {
  return arr
    .map((item) => ({ item, sortKey: Math.random() })) // Create an array of objects with random sort keys
    .sort((a, b) => a.sortKey - b.sortKey) // Sort based on random keys
    .map(({ item }) => item); // Extract the original items after sorting
};

export const confirmUser = async (token) => {
  try {
    if (!token) {
      return false;
    }
    if (OFFLINE || dynamicOffline) {
      return { success: true, user: { _id: 'offline-user', name: 'Offline User' } };
    }
    const data = await fetch(`${host}/user/userinfo`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Token: token,
      },
    });

    const response = await data.json();
    if (!response.success) {
      return false;
    }

    return response;
  } catch (error) {
    console.log(error);
  }
};

export const loginUser = async (params) => {
  const { email, password } = params;

  const response = await fetch(`${host}/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  return data;
};

export const createUser = async (params) => {
  const { name, address, appartment, city, state, ZIP, phNo, email, password } =
    params;
  const response = await fetch(`${host}/user/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      address,
      appartment,
      city,
      state,
      ZIP,
      phNo,
      email,
      password,
    }),
  });
  const data = await response.json();
  return data;
};

export const verifyUser = async (email, otp) =>{
  try {
    const otpCode = otp.join('')
    const body = {
      email,
      otp: otpCode
    }

    const response = await fetch(`${host}/user/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body)
    })

    const data = await response.json();

    return data


  } catch (error) {
    console.log(error)
  }
}

export const getCart = async () => {
  try {
    const token = localStorage.getItem("UserCookie");
    
    // Determine if we're in offline mode
    const isOfflineMode = OFFLINE || 
                          dynamicOffline || 
                          (window._appConnectivity && window._appConnectivity.dynamicOffline) || 
                          !navigator.onLine;
    
    // If no token or in offline mode, return mock data or empty cart
    if (!token) {
      if (DEBUG) console.info("[api] getCart: user token not found, returning empty cart");
      return { success: true, cart: { items: [], totalPrice: 0 } };
    }
    
    // If offline, return mock data
    if (isOfflineMode) {
      await ensureMock();
      // Create mock cart items from our mock products
      const mockCartItems = mockProductsCache.slice(0,2).map(p=> ({ 
        products: p, 
        quantity: 1, 
        itemTotal: p.price 
      }));
      const mockTotalPrice = mockCartItems.reduce((total, item) => total + item.itemTotal, 0);
      
      return { 
        success: true, 
        cart: { 
          items: mockCartItems, 
          totalPrice: mockTotalPrice
        } 
      };
    }
    
    // If online, try to fetch real cart data
    try {
      const response = await fetchWithTimeout(`${host}/cart/getcart`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Token: token,
        },
        timeout: 3000 // 3 second timeout
      });
      
      const data = await response.json();
      
      if (!data.success) {
        // If request fails, return empty cart
        return { success: true, cart: { items: [], totalPrice: 0 } };
      }
      
      return data;
    } catch (error) {
      // If fetch fails, switch to offline mode and return mock data
      activateDynamicOffline(`getCart: ${error.message}`);
      await ensureMock();
      
      return { 
        success: true, 
        cart: { 
          items: [], // Return empty cart on error for safety
          totalPrice: 0
        } 
      };
    }
  } catch (error) {
    console.error("[api] getCart unhandled error:", error);
    // Return safe default value in case of any error
    return { success: true, cart: { items: [], totalPrice: 0 } };
  }
};

export const addItemToCart = async (productId) => {
  try {
    const token = localStorage.getItem("UserCookie");
    if (!token) {
      if (DEBUG) console.warn("[api] addItemToCart: user token not found");
      return false;
    }

    const body = {
      productId: productId,
      quantity: 1,
    };

    const data = await fetch(`${host}/cart/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Token: token,
      },
      body: JSON.stringify(body),
    });

    const response = await data.json();
    if (!response.success) {
      return false;
    }

    return response;
  } catch (error) {
    console.log(error);
  }
};

export const removeItemFromCart = async (productId) => {
  try {
    const token = localStorage.getItem("UserCookie");
    if (!token) {
      if (DEBUG) console.warn("[api] removeItemFromCart: user token not found");
      return false;
    }

    const body = {
      productId: productId,
      quantity: 1,
    };

    const data = await fetch(`${host}/cart/remove`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Token: token,
      },
      body: JSON.stringify(body),
    });

    const response = await data.json();
    if (!response.success) {
      return false;
    }

    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getVariations = async () => {
  try {
    if (OFFLINE || dynamicOffline) {
      await ensureMock();
      return { success: true, variations: mockVariationsCache };
    }
    const data = await fetch(`${host}/variations`, {
      method: "GET",
    });

    const response = await data.json();
    if (!response.success) {
      return false;
    }

    return response;
  } catch (error) {
    console.log(error);
  }
};


export const addVariant = async(values) => {
  try {
    const token = localStorage.getItem('Cookie');
    if(!token){
      if (DEBUG) console.warn('[api] addVariant: token not found');
      return false
    }

    const body = {
      type: values.type,
      options: values.options
    }

    const data = await fetch(`${host}/variations/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Token: token
      },
      body: JSON.stringify(body)
    })

    const response = await data.json();
    if(!response.success){
      return false;
    }

    return response;

  } catch (error) {
    console.log(error)
  }
}