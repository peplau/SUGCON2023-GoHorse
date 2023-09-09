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
        <Script src="/personalize-connect.js"></Script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              var __personalizeDatasources = ${personalizeDatasources.value || '""'};
              document.addEventListener("DOMContentLoaded", function() {
                setTimeout(() => {
                  document.getElementById("qtdDatasources").innerHTML = __personalizeDatasources.length;
                }, "5000");
              });
            `,
          }}
        ></script>
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
