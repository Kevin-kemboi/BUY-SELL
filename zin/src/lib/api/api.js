const host = "http://localhost:5000";

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
      console.log("Token not found");
      return false;
    }
    console.log(formData);
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
      console.log("Token not found");
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

    console.log(product)

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
  } catch (error) {
    console.log(error);
    return { products: [] }; // Return an empty list if there is an error
  }
};

export const getProductsFrontend = async (params = "") => {
  try {
    const { filter, sortBy } = params;
    const response = await fetch(`${host}/admin/productslist`, {
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
  } catch (error) {
    console.log(error);
    return { products: [] }; // Return an empty list if there is an error
  }
};

export const getProductById = async (productId) => {
  try {
    const body = {
      id: productId,
    };

    const response = await fetch(`${host}/admin/getproductbyid`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteProduct = async (id) => {
  try {
    const token = localStorage.getItem("Cookie");
    if (!token) {
      console.log("Token not found");
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

    console.log(response);
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
    console.log(otpCode)
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

    console.log(data)
    return data


  } catch (error) {
    console.log(error)
  }
}

export const getCart = async () => {
  try {
    const token = localStorage.getItem("UserCookie");
    if (!token) {
      console.log("Token not found");
      return false;
    }
    const data = await fetch(`${host}/cart/getcart`, {
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

    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const addItemToCart = async (productId) => {
  try {
    const token = localStorage.getItem("UserCookie");
    if (!token) {
      console.log("Token not found");
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

    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const removeItemFromCart = async (productId) => {
  try {
    const token = localStorage.getItem("UserCookie");
    if (!token) {
      console.log("Token not found");
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
      console.log('token not found')
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
    console.log(response)
    if(!response.success){
      return false;
    }

    return response;

  } catch (error) {
    console.log(error)
  }
}