<template>
  <div>

  </div>
</template>

<script>
import Oidc from "oidc-client";
new Oidc.UserManager()
  .signinRedirectCallback()
  .then(() => {
    window.location = "/#/MyHome";
  })
  .catch((e) => {
    console.log(e);
  });
export default{}
</script>