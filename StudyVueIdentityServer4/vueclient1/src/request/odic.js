import Oidc from "oidc-client";
var config = {
  authority: "https://localhost:5001",
  client_id: "js",
  redirect_uri: "http://localhost:5003/CallBack",
  response_type: "id_token token",
  scope: "openid profile api1",
  post_logout_redirect_uri: "http://localhost:5003/"
};

export function oidc(){
    return new Oidc.UserManager(config);
}