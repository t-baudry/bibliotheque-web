var e={meta:[{charset:`utf-8`},{name:`viewport`,content:`width=device-width, initial-scale=1, viewport-fit=cover`},{name:`robots`,content:`index, follow`}],link:[{id:`favicon`,rel:`icon`,type:`image/svg+xml`,href:`/icons/favicon.ico`},{rel:`icon`,type:`image/png`,sizes:`96x96`,href:`/icons/favicon-96x96.png`},{rel:`apple-touch-icon`,sizes:`180x180`,href:`/icons/apple-touch-icon.png`}],style:[],script:[{hid:`consent-script`,innerHTML:`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      if(!window.isFlag){ // weird reset on first page change
          window.isFlag = true;
          if (localStorage.getItem('storedConsentLocale') === null) {
          gtag('consent', 'default', {
            'ad_storage': 'denied',
            'analytics_storage': 'denied'
          });
        }else{
            var consent = JSON.parse(localStorage.getItem('storedConsentLocale'))
            var consentMode = {
              ad_storage: consent.ad_storage ? 'granted' : 'denied',
              analytics_storage: consent.analytics_storage ? 'granted' : 'denied',
              functionality_storage: consent.functionality_storage
                ? 'granted'
                : 'denied',
              personalization_storage: consent.personalization_storage
                ? 'granted'
                : 'denied',
              security_storage: consent.security_storage ? 'granted' : 'denied',
            }
            gtag('consent', 'default', consentMode)
          }
        }
        `},{type:`text/javascript`,innerHTML:`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-NTVT8QWQ');`},{innerHTML:`{"@context":"https://schema.org","@type":"Organization","name":"OFFF Forum","description":"A one-week festival convening designers, artists, and digital culture practitioners","email":"info@offforum.com","url":"https://offforum.com","sameAs":["https://www.instagram.com/offf.montreal/","https://www.instagram.com/forum_mtl/"],"logo":"https://www.offforum.com/OFFFForum-logo.png","address":{"@type":"PostalAddress","streetAddress":"6250 Rue Hutchison 5e étage","addressLocality":"Montreal","addressCountry":"CA","addressRegion":"Quebec","postalCode":"H2V 4C5"}}`,type:`application/ld+json`}],noscript:[{innerHTML:`<iframe src='https://www.googletagmanager.com/ns.html?id=GTM-NTVT8QWQ' height='0' width='0' style='display:none;visibility:hidden'></iframe>`,tagPosition:`bodyOpen`}],__dangerouslyDisableSanitizersByTagID:{"consent-script":[`innerHTML`]}},t={id:`__nuxt-loader`},n={componentName:`NuxtLink`,prefetch:!0,prefetchOn:{visibility:!0}},r={deep:!1},i={},a=`#__nuxt`,o=`nuxt-app`,s=36e5,c=`vite:preloadError`;export{c as a,s as c,r as i,a as l,o as n,i as o,t as r,n as s,e as t};