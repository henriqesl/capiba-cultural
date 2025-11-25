const axios = require("axios");

class ConectaAPI {
  constructor() {
    this.baseURL = "https://gamificacao.homolog.app.emprel.gov.br/api";
    this.keycloakURL = "https://loginteste.recife.pe.gov.br/auth/realms/recife/protocol/openid-connect/token";

    this.token = null;
    this.basicAuth = "dGVzdDp0ZXN0"; 
  }

  async autenticar(username, password) {
    const params = new URLSearchParams();
    params.append("grant_type", "password");
    params.append("username", username);
    params.append("password", password);
    params.append("client_id", "app-recife");

    const res = await axios.post(this.keycloakURL, params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    });

    this.token = res.data.access_token;
    return this.token;
  }

  getAuthHeader() {
    if (!this.token) throw new Error("Token não definido");
    return { Authorization: `Bearer ${this.token}` };
  }

  async getSelf() {
    const res = await axios.get(`${this.baseURL}/self`, {
      headers: this.getAuthHeader()
    });
    return res.data;
  }

  async getProductItem(uuid, document) {
    const res = await axios.get(
      `${this.baseURL}/provider/product-item/${uuid}?document=${document}`,
      {
        headers: { Authorization: `Basic ${this.basicAuth}` }
      }
    );
    return res.data;
  }

  async fazerCheckIn(data) {
    const res = await axios.post(`${this.baseURL}/check-in`, data, {
      headers: this.getAuthHeader()
    });
    return res.data;
  }
}

module.exports = new ConectaAPI();
