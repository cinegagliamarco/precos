# Projeto De Preços

## Plano de Desenvolvimento
- [ ] Criação de um Banco da Dados
- [ ] Criação de um Script para efetuar a leitura de um produto (via crawler/scrapper)
- [ ] Criação de um Script para efetuar a leitura de um produto via Http request
- [ ] Criação de um Script para orquestrar ambos os scripts anteriores e armazenar os dados no banco de dados
- [ ] Criação de um gerador de JSON e/ou CSV
- [ ] Criação de um Http Server
- [ ] Criação de um Banco de dados Remoto
- [ ] Criação de um Http Server Remoto

## Referências


### Html Drogasil
* HTML:
https://www.drogasil.com.br/novalgina-1g-20-comprimidos.html
* API:
```
curl --location 'https://www.drogaraia.com.br/api/next/middlewareGraphql' \
--header 'accept: */*' \
--header 'accept-language: pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7' \
--header 'cache-control: no-cache' \
--header 'content-type: application/json' \
--header 'cookie: _ALGOLIA=anonymous-78a3665d-dd37-47e6-9890-7152d93ee6d2; _gcl_au=1.1.2074746660.1738096646; AwinChannelCookie=direct; user_unic_ac_id=2b4702fb-0fa9-6b91-dfae-6dd6efc6611f; advcake_trackid=d67f3ae0-2704-0448-b4d1-bcfdb6f0d963; _evga_89bd={%22uuid%22:%221f4008324039d036%22}; _gid=GA1.3.2015921123.1738096646; nav_id=2a15d9c5-06bc-4883-88ad-53d3b8ddbcbe; legacy_p=2a15d9c5-06bc-4883-88ad-53d3b8ddbcbe; chaordic_browserId=2a15d9c5-06bc-4883-88ad-53d3b8ddbcbe; legacy_c=2a15d9c5-06bc-4883-88ad-53d3b8ddbcbe; legacy_s=2a15d9c5-06bc-4883-88ad-53d3b8ddbcbe; guesttoken=cu3A7yENAtDo73hFp97r1HYduTowrcqz; carttoken=cu3A7yENAtDo73hFp97r1HYduTowrcqz; _pin_unauth=dWlkPU9UYzVPR1prTWpjdE5EWXhZUzAwT0Rjd0xUazVaamd0TVdRMVpHTmpZekkyT0RNeg; _tt_enable_cookie=1; _ttp=9p5AIlQm4l2V8URkfFdeJO4BWqQ.tt.2; blueID=e3298347-7c7e-418c-8275-60b91f625081; _sfid_9ae0={%22anonymousId%22:%221f4008324039d036%22%2C%22consents%22:[]}; _hjSessionUser_553747=eyJpZCI6Ijk5MmU1ODFkLWViMGQtNTkwYy05Yzg1LTQ1NGMwYzlkOWY1ZSIsImNyZWF0ZWQiOjE3MzgwOTY2NDYwMDAsImV4aXN0aW5nIjp0cnVlfQ==; impulsesuite_session=1738177591938-0.016048282442126638; _hjSession_553747=eyJpZCI6ImQwYWM0YTI3LWRhNjMtNDNiMC04NmFhLWU1NzcxZDRhNjUzMiIsImMiOjE3MzgxNzc1OTIwNTMsInMiOjAsInIiOjAsInNiIjowLCJzciI6MCwic2UiOjAsImZzIjowLCJzcCI6MH0=; OptanonAlertBoxClosed=2025-01-29T19:06:52.914Z; _ga=GA1.1.213680480.1738096646; cto_bundle=GyIgEF83RU5IMFFobE1UcU9kQVd2TDRCbjVTaGw2ZDRMdzhod1RmZVdtRkNJTG4yemQ0UWRSSHo3Q0NpeFhvd3pMd0NOWjBoTlhVa2J0a2h2ODV6VTR6WjBjOEFpVEJxNk5DNVJYRFV1UCUyRiUyQkczTTZvOCUyRkJxaVVnQzczZWc4T1JWYm1MNHZ0ZXFZREdNZmJtMFhrJTJGckRQQllIbmslMkZmazZZRWVyUWxTcHBnT21DTEFpdlFqRzk0cU9nQ0loeXNCdTdTZmNtVDRVdTFnQ2YySHBvMXVpSERHZlZzTzRWVFZuMXZPUk9ZU3pwcUNzNUolMkJqcXQ0Sm9hRXh2U1o0SCUyRjN3b1RieGFSRFlsOE5aWVFuandwY0dGSVN6M01NcVpmeUR6Q05JNUpzdFdUTmZJdHVoOCUyQkdjNEMlMkZDeklnYWVTR1lyaG9PUQ; OptanonConsent=isGpcEnabled=0&datestamp=Wed+Jan+29+2025+16%3A09%3A14+GMT-0300+(Brasilia+Standard+Time)&version=202401.2.0&browserGpcFlag=0&isIABGlobal=false&hosts=&consentId=b1527c52-58e0-4d9d-90a4-ec4928d34b15&interactionCount=2&landingPath=NotLandingPage&groups=C0002%3A1%2CC0004%3A1%2CC0001%3A1%2CC0008%3A1&AwaitingReconsent=false&geolocation=BR%3BSC; _dd_s=rum=0&expire=1738178698508; _ga_1GGG74MQ6B=GS1.1.1738177592.3.1.1738177803.60.0.0' \
--header 'origin: https://www.drogaraia.com.br' \
--header 'pragma: no-cache' \
--header 'priority: u=1, i' \
--header 'referer: https://www.drogaraia.com.br/aparelho-auditivo-amplificador-de-som-bte-bateria-elgin-1052469.html' \
--header 'sec-ch-ua: "Not A(Brand";v="8", "Chromium";v="132", "Google Chrome";v="132"' \
--header 'sec-ch-ua-mobile: ?0' \
--header 'sec-ch-ua-platform: "macOS"' \
--header 'sec-fetch-dest: empty' \
--header 'sec-fetch-mode: cors' \
--header 'sec-fetch-site: same-origin' \
--header 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36' \
--header 'x-session-customer;' \
--header 'x-session-token-cart: cu3A7yENAtDo73hFp97r1HYduTowrcqz' \
--data '{"query":"query getProduct($sku: String!) {\n  productBySku(sku: $sku) {\n    id\n    sku\n    name\n    price\n    price_aux {\n      value_to\n      value_from\n      lmpm_value_to\n      lmpm_qty\n      __typename\n    }\n    status\n    custom_attributes {\n      attribute_code\n      value_string\n      value {\n        id\n        label\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n","variables":{"sku":"1052469"}}''
```

### API Drogal
https://www.drogal.com.br/api/catalog_system/pub/products/search?fq=alternateIds_Ean:7896015511159

### Banco de Dados da Alpha7
https://docs.google.com/document/d/1bAvwvh6IVicT2XsDgj2xEz9rPkmy1BeDhghadzRtOk0/edit?tab=t.0
