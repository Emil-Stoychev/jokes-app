import useAuthStore from "../store/authStore";

export default async function routeGuard(to, from, next) {
  const authStore = useAuthStore();
  await authStore.checkUserByToken();

  if (authStore.isAuthenticated) {
    if (to.path === "/login" || to.path === "/register") {
      next("/");
    } else {
      next();
    }
  } else {
    if (to.path === "/login" || to.path === "/register") {
      next();
    } else {
      next("/login");
    }
  }
}
