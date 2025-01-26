// apiService.js
export const registerUser = async (userData) => {
  const formdata = new FormData();
  formdata.append("email", userData.email);
  formdata.append("first_name", userData.firstName);
  formdata.append("phone_no", userData.phoneNo);
  formdata.append("password", userData.password);
  formdata.append("password_confirmation", userData.passwordConfirmation);

  const requestOptions = {
    method: "POST",
    body: formdata,
    redirect: "follow",
  };

  try {
    const response = await fetch(`${userData.baseUrl}/register_user`, requestOptions);
    const result = await response.json(); // Use .json() if the API returns JSON
    return result;
  } catch (error) {
    console.error("Error in registerUser:", error);
    throw error; // Re-throw the error for further handling
  }
};


// apiService.js
export const loginUser = async (credentials) => {
  const formdata = new FormData();
  formdata.append("email", credentials.email);
  formdata.append("password", credentials.password);

  const requestOptions = {
    method: "POST",
    body: formdata,
    redirect: "follow",
  };

  try {
    const response = await fetch(`${credentials.baseUrl}/login_user`, requestOptions);
    const result = await response.json(); // Use .json() if the API returns JSON
    return result;
  } catch (error) {
    console.error("Error in loginUser:", error);
    throw error; // Re-throw the error for further handling
  }
};


export const completeUserProfile = async (profileData) => {
  try {
    const formData = new FormData();
    
    // Append all profile data to FormData
    Object.keys(profileData).forEach(key => {
      formData.append(key, profileData[key]);
    });

    const response = await fetch(`${profileData.baseUrl}/post_profile`, {
      method: 'POST',
      body: formData,
      headers: {
        // Add any required headers here, like authorization
        'Accept': 'application/json',
      },
    });

    const result = await response.json();

    if (result.status === 200) {
      return {
        status: "200",
        message: "Profile completed successfully",
        data: result.data
      };
    } else {
      return {
        status: result.status || "400",
        message: result.message || "Profile completion failed",
        data: null
      };
    }

  } catch (error) {
    console.error('Profile Completion Error:', error);
    return {
      status: "500",
      message: "Something went wrong while completing profile",
      error: error.message
    };
  }
};


// Add this to your ApiCalls.js file

export const saveUserPreferences = async (preferencesData) => {
  try {
    const formData = new FormData();
    
    // Append all preferences data to FormData
    Object.keys(preferencesData).forEach(key => {
      formData.append(key, preferencesData[key]);
    });

    const response = await fetch(`https://muslimdating.coderisehub.com/api/post_user_preferences`, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
      },
    });

    const result = await response.json();

    if (result.status === 200) {
      return {
        status: "200",
        message: "Preferences saved successfully",
        data: result.data
      };
    } else {
      return {
        status: result.status || "400",
        message: result.message || "Failed to save preferences",
        data: null
      };
    }

  } catch (error) {
    console.error('Preferences Save Error:', error);
    return {
      status: "500",
      message: "Something went wrong while saving preferences",
      error: error.message
    };
  }
};


// Global/Calls/UserActions.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export const likeUser = async (likedUserId) => {
  try {
    const userId = await AsyncStorage.getItem('user_id');
    const formdata = new FormData();
    formdata.append("user_id", "2");
    formdata.append("liked_user_id", "1");

    const response = await fetch("https://muslimdating.coderisehub.com/api/like_user", {
      method: "POST",
      body: formdata,
    });
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const followUser = async (followedId) => {
  try {
    // const token = await AsyncStorage.getItem('token');
    const userId = await AsyncStorage.getItem('user_id');
    const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL211c2xpbWRhdGluZy5jb2RlcmlzZWh1Yi5jb20vYXBpL2xvZ2luX3VzZXIiLCJpYXQiOjE3Mzc4MjEzMzgsImV4cCI6MTczNzgyNDkzOCwibmJmIjoxNzM3ODIxMzM4LCJqdGkiOiJ4ZW1sSEhPc2tKZlJXdmVGIiwic3ViIjoiMiIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.YIpDQrAoo3EVyZjno67YQD5_s9USiIFnL6pHP1drJ-M"
    
    const formdata = new FormData();
    formdata.append("follower_id", "2");
    formdata.append("followed_id", "1");

    const response = await fetch(
      "https://muslimdating.coderisehub.com/api/send_follow_request", 
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formdata,
      }
    );
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const unfollowUser = async (followedId) => {
  try {
    // const token = await AsyncStorage.getItem('token');
    const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL211c2xpbWRhdGluZy5jb2RlcmlzZWh1Yi5jb20vYXBpL2xvZ2luX3VzZXIiLCJpYXQiOjE3Mzc4MjEzMzgsImV4cCI6MTczNzgyNDkzOCwibmJmIjoxNzM3ODIxMzM4LCJqdGkiOiJ4ZW1sSEhPc2tKZlJXdmVGIiwic3ViIjoiMiIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.YIpDQrAoo3EVyZjno67YQD5_s9USiIFnL6pHP1drJ-M"

    const formdata = new FormData();
    formdata.append("followed_id", "1");

    const response = await fetch(
      "https://muslimdating.coderisehub.com/api/unfollow",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formdata,
      }
    );
    return await response.json();
  } catch (error) {
    throw error;
  }
};