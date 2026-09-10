// CPE — service worker
// v1 (10/09/2026) — MESMO DESENHO DO SISTEMA DA RF: este service worker
// NAO cacheia nada.
//
// Motivo, aprendido no rf-logistica-app: versoes antigas presas no cache de
// varios aparelhos causaram perda de dados, porque o JS antigo continuava
// rodando e sobrescrevia a nuvem com um estado velho. Cache agressivo de PWA
// somado a bug de dados e combinacao perigosa.
//
// Ele existe so pra que o app possa ser INSTALADO na tela inicial (o Android
// exige um service worker registrado). Todo aparelho sempre busca a versao
// mais nova na rede, como um site normal.

self.addEventListener("install", function () {
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (nomes) {
      return Promise.all(nomes.map(function (nome) { return caches.delete(nome); }));
    }).then(function () {
      return self.clients.claim();
    }).then(function () {
      return self.clients.matchAll({ type: "window" });
    }).then(function (clientes) {
      clientes.forEach(function (c) { c.navigate(c.url); });
    })
  );
});

// Sem handler de "fetch": nenhuma requisicao e interceptada.
