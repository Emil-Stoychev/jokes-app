import useAuthStore from "../store/authStore";

export default async function routeGuard(to, from, next) {
  const authStore = useAuthStore();
  authStore.startLoading();
  await authStore.checkUserByToken();

  if(to.path === '/') {
    next()
  }

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
  authStore.stopLoading();
}
