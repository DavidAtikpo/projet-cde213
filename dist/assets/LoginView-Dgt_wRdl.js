import{a as g,A as c}from"./config-DsceXT9y.js";import{_ as h,o as a,c as l,a as o,w as m,i as p,v as f,j as w,n as u,t as _,e as v,k as y,p as b,b as k}from"./index-C4JoDdy0.js";import{_ as P}from"./logo-BBSAZehn.js";import{_ as V}from"./check-ov41iK4c.js";const M={data(){return{loading:!1,showPassword:!1,popupVisible:!1,loginData:{email:"",password:""},errorMessage:""}},methods:{gotToForgot(){this.$router.push("/forgot")},goToRegister(){this.$router.push("/user/signup")},togglePasswordVisibility(){this.showPassword=!this.showPassword},handleLogin(){this.loading=!0,this.errorMessage="",console.log("response",this.loginData),g.post(`${c}/user/login`,this.loginData,{withCredentials:!0}).then(r=>{localStorage.setItem("token",r.data.token),localStorage.setItem("user",r.data.firstName),r.status===200&&(this.popupVisible=!0,setTimeout(()=>{r.data.role==="Coordinateur"?this.$router.push("/admin/analytics"):this.$router.push("/user/suivi")}))}).catch(r=>{var s,d;this.errorMessage=((d=(s=r.response)==null?void 0:s.data)==null?void 0:d.error)||"Login failed. Please try again."}).finally(()=>{this.loading=!1})},clearError(){this.errorMessage=""},closePopup(){this.popupVisible=!1,this.$router.push("/student/analytics")}}},n=r=>(b("data-v-32041ab1"),r=r(),k(),r),C={class:"overall"},D={class:"login-container"},I=n(()=>o("div",null,[o("a",{href:"https://projet-cde213.vercel.app/"},[o("img",{class:"login-logo",src:P,alt:"logo"})])],-1)),T=n(()=>o("h2",{class:"login-title"},"Connectez ici",-1)),E={class:"password-container"},S=["type"],x={key:0,class:"error"},L=["disabled"],B={key:0,class:"fas fa-circle-notch fa-spin"},N={key:1},R={class:"login-p"},z={class:"popup",id:"popup"},A=n(()=>o("img",{class:"check",src:V},null,-1)),F=n(()=>o("h2",null,"Login was successful",-1));function U(r,s,d,j,i,t){return a(),l("div",C,[o("div",D,[I,T,o("form",{class:"login-form",onSubmit:s[7]||(s[7]=m((...e)=>t.handleLogin&&t.handleLogin(...e),["prevent"]))},[p(o("input",{"onUpdate:modelValue":s[0]||(s[0]=e=>i.loginData.email=e),class:"form-input",type:"email",name:"email",placeholder:"Email",onInput:s[1]||(s[1]=(...e)=>t.clearError&&t.clearError(...e)),required:""},null,544),[[f,i.loginData.email]]),o("div",E,[p(o("input",{id:"password",class:u(["form-input inner-pswd",{"is-invalid":i.errorMessage}]),type:i.showPassword?"text":"password",name:"password","onUpdate:modelValue":s[2]||(s[2]=e=>i.loginData.password=e),placeholder:"Password",onInput:s[3]||(s[3]=(...e)=>t.clearError&&t.clearError(...e)),required:""},null,42,S),[[w,i.loginData.password]]),o("i",{class:u(["toggle-password-icon",i.showPassword?"fas fa-eye-slash":"fas fa-eye"]),onClick:s[4]||(s[4]=(...e)=>t.togglePasswordVisibility&&t.togglePasswordVisibility(...e))},null,2)]),i.errorMessage?(a(),l("span",x,_(i.errorMessage),1)):v("",!0),o("div",null,[o("a",{class:"forgot",onClick:s[5]||(s[5]=(...e)=>t.gotToForgot&&t.gotToForgot(...e))},"Mot de passe oublié?")]),o("button",{class:"form-button",type:"submit",disabled:i.loading},[i.loading?(a(),l("i",B)):(a(),l("span",N,"Connecter"))],8,L),o("div",R,[y(" Vous n'avez pas de compte? "),o("a",{onClick:s[6]||(s[6]=(...e)=>t.goToRegister&&t.goToRegister(...e)),class:"sign-up-link",href:"#"},"Inscription")])],32)]),o("div",z,[A,F,o("button",{onClick:s[8]||(s[8]=(...e)=>t.closePopup&&t.closePopup(...e)),type:"button"},"OK")])])}const H=h(M,[["render",U],["__scopeId","data-v-32041ab1"]]);export{H as default};
