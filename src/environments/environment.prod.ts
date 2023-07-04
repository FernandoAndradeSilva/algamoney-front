export const environment = {
  production: true,
  apiUrl: 'http://ec2-15-228-39-180.sa-east-1.compute.amazonaws.com:8080',
  tokenAllowedDomains: [ /ec2-15-228-39-180.sa-east-1.compute.amazonaws.com:8080/ ],
  tokenDisallowedRoutes: [/\/oauth\/token/],
};
