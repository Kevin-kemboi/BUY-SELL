export const createAdminUser = async (params) => {
  const { username, email, password, role } = params;
  const response = await fetch("http://localhost:5000/admin/signup", {
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
    const data = await fetch('http://localhost:5000/admin/userinfo', {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Token": token,
          }
    })

    const response = await data.json();
    if(!response.role === 'admin'){
        return false;
    }
    
    return true;


  } catch (error) {
    console.log(error);
  }
};

export const loginAdmin = async (params) => {
  const { email, password } = params;

  const response = await fetch("http://localhost:5000/admin/login",
    {
      method:"POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({email, password})
    }
  )

  const data = await response.json();
  return data;

}

export const getAdmins = async () => {
  const adminCount = await fetch("http://localhost:5000/admin/getadmins",{
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  })

  const data = await adminCount.json();
  return data;
}