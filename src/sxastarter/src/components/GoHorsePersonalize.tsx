import React from 'react';
import { useSitecoreContext } from '@sitecore-jss/sitecore-jss-nextjs';
import Script from 'next/script';

const GoHorsePersonalize = (): JSX.Element => {
  const sitecoreContext = useSitecoreContext().sitecoreContext;

  if (!sitecoreContext || !sitecoreContext.route || !sitecoreContext.route.fields) {
    return (
      <div className="alert alert-danger" role="alert">
        sitecoreContext, sitecoreContext.route or sitecoreContext.route.fields are empty
      </div>
    );
  }
  const personalizeDatasources = sitecoreContext.route.fields['PersonalizeDatasources'];
  if (!personalizeDatasources) {
    return (
      <div className="alert alert-danger" role="alert">
        This item doesn&apos;t have the field
        sitecoreContext.route.fields[&apos;PersonalizeDatasources&apos;]
      </div>
    );
  }

  // Check if personalizeDatasources is a Field type
  if ('value' in personalizeDatasources) {
    return (
      <div className="alert alert-info" role="alert">
        Personalize Datasources here: <span id="qtdDatasources"></span>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            // Initialize the engage variable
            var engage = undefined;
            
            // Create and inject the <script> tag into the HTML
            var s = document.createElement("script");
            s.type = "text/javascript";
            s.async = true;
            s.src = "https://d1mj578wat5n4o.cloudfront.net/sitecore-engage-v.1.4.0.min.js";
            var x = document.querySelector("script");
            x.parentNode.insertBefore(s, x);    

            // Initialize the Engage SDK
            s.addEventListener("load", async () => {
                var settings = {
                    clientKey: "${process.env.NEXT_PUBLIC_CDP_CLIENT_KEY || ''}",
                    targetURL: "${process.env.NEXT_PUBLIC_CDP_TARGET_URL || ''}",
                    pointOfSale: "${process.env.NEXT_PUBLIC_CDP_POINTOFSALE || ''}",
                    cookieDomain: window.location.host.replace(/^www\./, ''),
                    cookieExpiryDays: 365,
                    forceServerCookieMode: false,
                    includeUTMParameters: true,
                    webPersonalization: true /* boolean or object. See Settings object for all options. Default: false */
                };
                engage = await window.Engage.init(settings);                
            });
            `,
          }}
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              var __personalizeDatasources = ${personalizeDatasources.value};
              document.addEventListener("DOMContentLoaded", function() {
                setTimeout(() => {
                  document.getElementById("qtdDatasources").innerHTML = __personalizeDatasources.length;
                }, "5000");
                setTimeout(() => {
                  document.getElementById("qtdDatasources").innerHTML += ".";
                  setTimeout(() => {
                    document.getElementById("qtdDatasources").innerHTML += ".";
                    setTimeout(() => {
                      document.getElementById("qtdDatasources").innerHTML += ".";
                      setTimeout(() => {
                        document.getElementById("qtdDatasources").innerHTML += ".";
                      }, "1000");  
                    }, "1000");
                  }, "1000");
                }, "1000");
              });
            `,
          }}
        ></script>
        <Script src="/personalize-connect.js"></Script>
      </div>
    );
  }

  // Handle the case where personalizeDatasources is an Item or Item[]
  return (
    <div className="alert alert-danger" role="alert">
      Something strange - sitecoreContext.route.fields[&apos;PersonalizeDatasources&apos;] is not a
      field
    </div>
  );
};

export default GoHorsePersonalize;
