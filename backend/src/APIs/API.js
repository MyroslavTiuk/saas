import Config from "../config";
import {getAccessToken} from "../utils/helper";

const baseUrl = Config.api_url;

class API {
  async loginUser(user) {
    try {
      const response = await fetch(`${baseUrl}/v1/admin/auth/login`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        credentials: 'include',
        body: JSON.stringify(user),
      });
      let data = await response.json();
      if (response.ok) {
        return {
          status: true,
          data: data,
          message: 'success',
        };
        // return await response.json();
      } else {
        return {
          status: false,
          message: data["message"],
        }
      }
    } catch (error) {
      return {
        status: false,
        message: "Invalid username or password!",
      }
    }
  }

  async getMe() {
    try {
      const response = await fetch(`${baseUrl}/v1/admin/user/me`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: getAccessToken(),
        },
        credentials: 'include',
        method: "GET",
      });
      if (response.ok) {
        return await response.json();
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  async logout() {
    try {
      const response = await fetch(`${baseUrl}/v1/admin/auth/logout`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: getAccessToken(),
        },
        credentials: 'include',
        method: "POST",
      });
      if (response.ok) {
        return await response.json();
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  async forgotPassword(user) {
    try {
      let response = await fetch(`${baseUrl}/v1/admin/auth/forget_password/verify-send`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        credentials: 'include',
        body: JSON.stringify(user),
      });
      if (response.ok) {
        return await response.json();
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  async forgetPasswordSetPassword(data) {
    try {
      let response = await fetch(`${baseUrl}/v1/admin/auth/forget_password/set-password`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (response.ok) {
        return await response.json();
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  // ---------------------------------------------------- USERS ------------------------------------------------------------

  async getAllUsers(queryString) {
    try {
      const response = await fetch(`${baseUrl}/v1/admin/user/get_all_users${queryString}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: getAccessToken(),
        },
        credentials: 'include',
        method: "GET",
      });
      if (response.ok) {
        return await response.json();
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  async addAdminUser(user) {
    try {
      const response = await fetch(`${baseUrl}/v1/admin/user/add_admin_user`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: getAccessToken(),
        },
        method: "POST",
        credentials: 'include',
        body: JSON.stringify(user),
      });
      if (response.ok) {
        return await response.json();
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  async getUserById(user_id) {
    try {
      const response = await fetch(`${baseUrl}/v1/admin/user/get_user?user_id=${user_id}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: getAccessToken(),
        },
        credentials: 'include',
        method: "GET",
      });
      if (response.ok) {
        return await response.json();
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  async updateAdminUser(user) {
    try {
      const response = await fetch(`${baseUrl}/v1/admin/user/update_admin_user`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: getAccessToken(),
        },
        method: "PUT",
        credentials: 'include',
        body: JSON.stringify(user),
      });
      if (response.ok) {
        return await response.json();
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  async deleteAdminUser(user_id) {
    try {
      const response = await fetch(`${baseUrl}/v1/admin/user/delete_admin_user?user_id=${user_id}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: getAccessToken(),
        },
        credentials: 'include',
        method: "DELETE",
      });
      if (response.ok) {
        return await response.json();
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  async restoreAdminUser(user_id) {
    try {
      const response = await fetch(`${baseUrl}/v1/admin/user/restore_admin_user`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: getAccessToken(),
        },
        method: "PUT",
        credentials: 'include',
        body: JSON.stringify({
          "user_id": user_id
        }),
      });
      if (response.ok) {
        return await response.json();
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  async deleteAdminLocationUser(user_id) {
    try {
      const response = await fetch(`${baseUrl}/v1/admin/manager/delete_admin_location_user?user_id=${user_id}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: getAccessToken(),
        },
        credentials: 'include',
        method: "DELETE",
      });
      if (response.ok) {
        return await response.json();
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  async restoreAdminLocationUser(user_id) {
    try {
      const response = await fetch(`${baseUrl}/v1/admin/manager/restore_admin_location_user`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: getAccessToken(),
        },
        method: "PUT",
        credentials: 'include',
        body: JSON.stringify({
          "user_id": user_id
        }),
      });
      if (response.ok) {
        return await response.json();
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  async resetPasswordAdmin(data) {
    try {
      const response = await fetch(`${baseUrl}/v1/admin/user/reset_password_admin`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: getAccessToken(),
        },
        method: "POST",
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (response.ok) {
        return await response.json();
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  async resetPassword(data) {
    try {
      const response = await fetch(`${baseUrl}/v1/admin/user/reset_password`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: getAccessToken(),
        },
        method: "POST",
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (response.ok) {
        return await response.json();
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  async changeUserStatus(user) {
    try {
      const response = await fetch(`${baseUrl}/v1/admin/user/change_status`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: getAccessToken(),
        },
        method: "PUT",
        credentials: 'include',
        body: JSON.stringify(user),
      });
      if (response.ok) {
        return await response.json();
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  async updateProfile(user) {
    try {
      const response = await fetch(`${baseUrl}/v1/admin/user/update_profile`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: getAccessToken(),
        },
        method: "PUT",
        credentials: 'include',
        body: JSON.stringify(user),
      });
      if (response.ok) {
        return await response.json();
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  // ---------------------------------------------------- EMPLOYEES ------------------------------------------------------------

  async addEmployee(employee) {
    try {
      const response = await fetch(`${baseUrl}/v1/admin/employee/add_employee`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: getAccessToken(),
        },
        method: "POST",
        credentials: 'include',
        body: JSON.stringify(employee),
      });
      if (response.ok) {
        return await response.json();
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  async getEmployee(employee_no) {
    try {
      const response = await fetch(`${baseUrl}/v1/admin/employee/get_employee?employee_no=${employee_no}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: getAccessToken(),
        },
        method: "GET",
        credentials: 'include',
      });
      if (response.ok) {
        return await response.json();
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  async updateEmployee(employee) {
    try {
      const response = await fetch(`${baseUrl}/v1/admin/employee/update_employee`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: getAccessToken(),
        },
        method: "PUT",
        credentials: 'include',
        body: JSON.stringify(employee),
      });
      if (response.ok) {
        return await response.json();
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  async getAllEmployees(queryString) {
    try {
      const response = await fetch(`${baseUrl}/v1/admin/employee/get_employees${queryString}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: getAccessToken(),
        },
        method: "GET",
        credentials: 'include',
      });
      if (response.ok) {
        return await response.json();
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  async deleteEmployee(employee_no) {
    try {
      const response = await fetch(`${baseUrl}/v1/admin/employee/delete_employee?employee_no=${employee_no}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: getAccessToken(),
        },
        method: "DELETE",
        credentials: 'include',
      });
      if (response.ok) {
        return await response.json();
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  async getArchivedEmployees(queryString) {
    try {
      const response = await fetch(`${baseUrl}/v1/admin/employee/get_archived_employees${queryString}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: getAccessToken(),
        },
        method: "GET",
        credentials: 'include',
      });
      if (response.ok) {
        return await response.json();
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  async getArchivedEmployee(employee_no) {
    try {
      const response = await fetch(`${baseUrl}/v1/admin/employee/get_archived_employee?employee_no=${employee_no}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: getAccessToken(),
        },
        method: "GET",
        credentials: 'include',
      });
      if (response.ok) {
        return await response.json();
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  async archiveOn(data) {
    try {
      const response = await fetch(`${baseUrl}/v1/admin/employee/archive_on`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: getAccessToken(),
        },
        method: "PUT",
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (response.ok) {
        return await response.json();
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  async archiveOff(data) {
    try {
      const response = await fetch(`${baseUrl}/v1/admin/employee/archive_off`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: getAccessToken(),
        },
        method: "PUT",
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (response.ok) {
        return await response.json();
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  async getAccountNoDescList(admin_location_id) {
    try {
      const response = await fetch(`${baseUrl}/v1/admin/employee/get_admin_no_desc_list?admin_location_id=${admin_location_id}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: getAccessToken(),
        },
        method: "GET",
        credentials: 'include',
      });
      if (response.ok) {
        return await response.json();
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  async getPaypointDescList(admin_location_id, account_no_desc) {
    try {
      const response = await fetch(`${baseUrl}/v1/admin/employee/get_paypoint_desc_list?admin_location_id=${admin_location_id}&account_no_desc=${account_no_desc}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: getAccessToken(),
        },
        method: "GET",
        credentials: 'include',
      });
      if (response.ok) {
        return await response.json();
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  // ---------------------------------------------------- ADMIN LOCATIONS ------------------------------------------------------------

  async addAdminLocation(adminLocation) {
    try {
      const response = await fetch(`${baseUrl}/v1/admin/admin-location/add`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: getAccessToken(),
        },
        method: "POST",
        credentials: 'include',
        body: JSON.stringify(adminLocation),
      });
      if (response.ok) {
        return await response.json();
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  async getAllAdminLocationsByUserType(userType) {
    try {
      const response = await fetch(`${baseUrl}/v1/admin/admin-location/get_all_by_usertype?user_type=${userType}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: getAccessToken(),
        },
        method: "GET",
        credentials: 'include',
      });
      if (response.ok) {
        return await response.json();
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  async getAllLocations() {
    try {
      const response = await fetch(`${baseUrl}/v1/admin/admin-location/get_all`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: getAccessToken(),
        },
        method: "GET",
        credentials: 'include',
      });
      if (response.ok) {
        return await response.json();
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  async getAdminLocationById(id) {
    try {
      const response = await fetch(`${baseUrl}/v1/admin/admin-location/get?admin_location_id=${id}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: getAccessToken(),
        },
        method: "GET",
        credentials: 'include',
      });
      if (response.ok) {
        return await response.json();
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  async updateAdminLocation(adminLocation) {
    try {
      const response = await fetch(`${baseUrl}/v1/admin/admin-location/update`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: getAccessToken(),
        },
        method: "PUT",
        credentials: 'include',
        body: JSON.stringify(adminLocation),
      });
      if (response.ok) {
        return await response.json();
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  // ---------------------------------------------------- DEVICES ------------------------------------------------------------
  async getAllDevices(queryString) {
    try {
      const response = await fetch(`${baseUrl}/v1/admin/devices/get_devices${queryString}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: getAccessToken(),
        },
        method: "GET",
        credentials: 'include',
      });
      if (response.ok) {
        return await response.json();
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  async addDevice(device) {
    try {
      const response = await fetch(`${baseUrl}/v1/admin/devices/add_device`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: getAccessToken(),
        },
        method: "POST",
        credentials: 'include',
        body: JSON.stringify(device),
      });
      if (response.ok) {
        return await response.json();
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  async getDeviceById(device_id) {
    try {
      const response = await fetch(`${baseUrl}/v1/admin/devices/get_device_by_id?device_id=${device_id}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: getAccessToken(),
        },
        method: "GET",
        credentials: 'include',
      });
      if (response.ok) {
        return await response.json();
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  async updateDevice(device) {
    try {
      const response = await fetch(`${baseUrl}/v1/admin/devices/update_device`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: getAccessToken(),
        },
        method: "PUT",
        credentials: 'include',
        body: JSON.stringify(device),
      });
      if (response.ok) {
        return await response.json();
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  async deleteDevice(device_id) {
    try {
      const response = await fetch(`${baseUrl}/v1/admin/devices/delete_device?device_id=${device_id}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: getAccessToken(),
        },
        method: "DELETE",
        credentials: 'include',
      });
      if (response.ok) {
        return await response.json();
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  async changeDeviceStatus(device) {
    try {
      const response = await fetch(`${baseUrl}/v1/admin/devices/change_status`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: getAccessToken(),
        },
        method: "PUT",
        credentials: 'include',
        body: JSON.stringify(device),
      });
      if (response.ok) {
        return await response.json();
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }


  //-------------------------------------------------- MANAGERS -------------------------------------------------------------
  async getManagers(queryString) {
    try {
      const response = await fetch(`${baseUrl}/v1/admin/manager/get_managers${queryString}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: getAccessToken(),
        },
        method: "GET",
        credentials: 'include',
      });
      if (response.ok) {
        return await response.json();
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  async addManager(manager) {
    try {
      const response = await fetch(`${baseUrl}/v1/admin/manager/add_manager`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: getAccessToken(),
        },
        method: "POST",
        credentials: 'include',
        body: JSON.stringify(manager),
      });
      if (response.ok) {
        return await response.json();
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  async getManagerById(user_id) {
    try {
      const response = await fetch(`${baseUrl}/v1/admin/manager/get_manager?manager_id=${user_id}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: getAccessToken(),
        },
        method: "GET",
        credentials: 'include',
      });
      if (response.ok) {
        return await response.json();
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  //-------------------------------------------------- DASHBOARD -------------------------------------------------------------
  async getSummary() {
    try {
      const response = await fetch(`${baseUrl}/v1/admin/dashboard/summary`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: getAccessToken(),
        },
        method: "GET",
        credentials: 'include',
      });
      if (response.ok) {
        return await response.json();
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  async getDashboardEmployees(queryString) {
    try {
      const response = await fetch(`${baseUrl}/v1/admin/dashboard/get_dashboard_employees${queryString}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: getAccessToken(),
        },
        method: "GET",
        credentials: 'include',
      });
      if (response.ok) {
        return await response.json();
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  //-------------------------------------------------- Attendance -------------------------------------------------------------
  async getAttendanceDaily(queryString) {
    try {
      const response = await fetch(`${baseUrl}/v1/admin/attendance/daily${queryString}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: getAccessToken(),
        },
        method: "GET",
        credentials: 'include',
      });
      if (response.ok) {
        return await response.json();
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  async getAttendanceWeekly(queryString) {
    try {
      const response = await fetch(`${baseUrl}/v1/admin/attendance/weekly${queryString}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: getAccessToken(),
        },
        method: "GET",
        credentials: 'include',
      });
      if (response.ok) {
        return await response.json();
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  async getAttendanceMonthly(queryString) {
    try {
      const response = await fetch(`${baseUrl}/v1/admin/attendance/monthly${queryString}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: getAccessToken(),
        },
        method: "GET",
        credentials: 'include',
      });
      if (response.ok) {
        return await response.json();
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  async getAttendanceFortnightly(queryString) {
    try {
      const response = await fetch(`${baseUrl}/v1/admin/attendance/fortnightly${queryString}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: getAccessToken(),
        },
        method: "GET",
        credentials: 'include',
      });
      if (response.ok) {
        return await response.json();
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  //-------------------------------------------------- PAYLOADS -------------------------------------------------------------

  async getPayloads() {
    try {
      const response = await fetch(`${baseUrl}/v1/admin/payload/get_payloads`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: getAccessToken(),
        },
        method: "GET",
        credentials: 'include',
      });
      if (response.ok) {
        return await response.json();
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }
  // ------------------- Super Read Chart Report ---------------------------------
  async getSuperReadChartDaily(target) {
    try {
      const response = await fetch(`${baseUrl}/v1/admin/chart/manager_chart_daily?date=${target}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: getAccessToken(),
        },
        method: "GET",
        credentials: 'include',
      });
      if (response.ok) {
        return await response.json();
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }
  async getSuperReadChartWeekly(target) {
    try {
      const response = await fetch(`${baseUrl}/v1/admin/chart/manager_chart_weekly?year=${target}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: getAccessToken(),
        },
        method: "GET",
        credentials: 'include',
      });
      if (response.ok) {
        return await response.json();
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  async getSuperReadChartMonthly(target) {
    try {
      const response = await fetch(`${baseUrl}/v1/admin/chart/manager_chart_monthly?year=${target}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: getAccessToken(),
        },
        method: "GET",
        credentials: 'include',
      });
      if (response.ok) {
        return await response.json();
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  async getSuperReadChartFortnightly() {
    try {
      const response = await fetch(`${baseUrl}/v1/admin/chart/manager_chart_fortnightly`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: getAccessToken(),
        },
        method: "GET",
        credentials: 'include',
      });
      if (response.ok) {
        return await response.json();
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  // ------------------- Non Teacher Chart Report ---------------------------------
  async getNonTeacherChartDaily(target) {
    try {
      const response = await fetch(`${baseUrl}/v1/admin/chart/non_teacher_chart_daily?date=${target}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: getAccessToken(),
        },
        method: "GET",
        credentials: 'include',
      });
      if (response.ok) {
        return await response.json();
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  async getNonTeacherChartWeekly(target) {
    try {
      const response = await fetch(`${baseUrl}/v1/admin/chart/non_teacher_chart_weekly?year=${target}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: getAccessToken(),
        },
        method: "GET",
        credentials: 'include',
      });
      if (response.ok) {
        return await response.json();
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  async getNonTeacherChartMonthly(target) {
    try {
      const response = await fetch(`${baseUrl}/v1/admin/chart/non_teacher_chart_monthly?year=${target}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: getAccessToken(),
        },
        method: "GET",
        credentials: 'include',
      });
      if (response.ok) {
        return await response.json();
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  async getNonTeacherChartFortnightly() {
    try {
      const response = await fetch(`${baseUrl}/v1/admin/chart/non_teacher_chart_fortnightly`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: getAccessToken(),
        },
        method: "GET",
        credentials: 'include',
      });
      if (response.ok) {
        return await response.json();
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  // ------------------- Teacher Chart Report ---------------------------------
  async getTeacherChartDaily(target) {
    try {
      const response = await fetch(`${baseUrl}/v1/admin/chart/teacher_chart_daily?date=${target}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: getAccessToken(),
        },
        method: "GET",
        credentials: 'include',
      });
      if (response.ok) {
        return await response.json();
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  async getTeacherChartWeekly(target) {
    try {
      const response = await fetch(`${baseUrl}/v1/admin/chart/teacher_chart_weekly?year=${target}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: getAccessToken(),
        },
        method: "GET",
        credentials: 'include',
      });
      if (response.ok) {
        return await response.json();
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  async getTeacherChartMonthly(target) {
    try {
      const response = await fetch(`${baseUrl}/v1/admin/chart/teacher_chart_monthly?year=${target}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: getAccessToken(),
        },
        method: "GET",
        credentials: 'include',
      });
      if (response.ok) {
        return await response.json();
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  async getTeacherChartFortnightly() {
    try {
      const response = await fetch(`${baseUrl}/v1/admin/chart/teacher_chart_fortnightly`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: getAccessToken(),
        },
        method: "GET",
        credentials: 'include',
      });
      if (response.ok) {
        return await response.json();
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }
}

export default API;
