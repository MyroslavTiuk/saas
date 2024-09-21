import {useMemo} from "react";
import {useQuery} from "react-query";
import API from "../APIs/API";
import {BUREAUCRAT_USER, NON_TEACHER, NON_TEACHER_USER, SUPER_USER, TEACHER, TEACHER_USER} from "../constants";

/**
 * Return should contain:
 *
 * userAccessPrivilege
 * userAdminLocationLevel
 *
 */
export function useMe() {
  const {data: user, isError, isLoading} = useQuery({
    queryKey: "/users/me",
    queryFn: async () => {
      const result = await new API().getMe();
      if (result == null) {
        return null;
      }
      return {
        "id": result["data"]["id"],
        "email": result["data"]["email"],
        "access_privilege": result["data"]["access_privilege"] ?? "",
        "admin_location_level_user": result["data"]["admin_location_level_user"] ?? "",
        "creator": result["data"]["creator"] ?? "",
        "surname": result["data"]["surname"] ?? "",
        "given_name": result["data"]["given_name"] ?? "",
        "job_title": result["data"]["job_title"] ?? "",
        "office_phone": result["data"]["office_phone"] ?? "",
        "mobile_number": result["data"]["mobile_number"] ?? "",
        "admin_desc": result["data"]["admin_desc"] ?? "",
        "account_no_desc": result["data"]["account_no_desc"] ?? "",
        "paypoint_desc": result["data"]["paypoint_desc"] ?? "",
        "created_at": result["data"]["created_at"] ?? "",
        "updated_at": result["data"]["updated_at"] ?? "",
        "admin_location": result["data"]["admin_location"] ? {
          "id": result["data"]["admin_location"]["admin_location_id"],
          "admin_location": result["data"]["admin_location"]["admin_location"],
          "admin_desc": result["data"]["admin_location"]["admin_desc"],
          "user_type": result["data"]["admin_location"]["user_type"],
        } : null,
      };
    },
    cacheTime: 1000 * 60 * 60, // 1 hour
    staleTime: 1000 * 60 * 60, // 1 hour
  })

  const permissions = useMemo(
    () =>
      user
        ? {
          super: user.access_privilege === SUPER_USER,
          superRead: [SUPER_USER, BUREAUCRAT_USER].includes(user.access_privilege),
          teacher:
            [SUPER_USER, TEACHER_USER, BUREAUCRAT_USER].includes(
              user.access_privilege
            ) || user.admin_location?.user_type === TEACHER,
          non_teacher:
            [SUPER_USER, NON_TEACHER_USER, BUREAUCRAT_USER].includes(
              user.access_privilege
            ) || user.admin_location?.user_type === NON_TEACHER,
          topLevel: !!user.access_privilege,
          normal_user: user.access_privilege === "" && user.admin_location != null,
          report_teacher: [TEACHER_USER, SUPER_USER, BUREAUCRAT_USER].includes(user.access_privilege),
          report_non_teacher: [NON_TEACHER_USER, SUPER_USER, BUREAUCRAT_USER].includes(user.access_privilege),
        }
        : {
          super: false,
          superRead: false,
          teacher: false,
          non_teacher: false,
          topLevel: false,
          normal_user: false,
          report_teacher: false,
          report_non_teacher: false,
        },
    [user]
  );

  return {
    permissions,
    user,
    isError,
    isLoading,
  };
}
