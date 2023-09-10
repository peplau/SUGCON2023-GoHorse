import React from 'react';
import {
  Image as JssImage,
  Link as JssLink,
  RichText as JssRichText,
  ComponentRendering,
  ImageField,
  Field,
  LinkField,
} from '@sitecore-jss/sitecore-jss-nextjs';

interface Fields {
  PromoIcon: ImageField;
  PromoText: Field<string>;
  PromoLink: LinkField;
  PromoText2: Field<string>;
}

type PromoProps = {
  params: { [key: string]: string };
  fields: Fields;
  rendering: ComponentRendering;
};

const PromoDefaultComponent = (props: PromoProps): JSX.Element => (
  <div className={`component promo ${props.params.styles}`}>
    <div className="component-content">
      <span className="is-empty-hint">Promo</span>
    </div>
  </div>
);

export const Default = (props: PromoProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  if (props.fields) {
    return (
      <div
        className={`component promo ${props.params.styles}`}
        id={id ? id : undefined}
        cdp-container={`${props.rendering.uid}`}
      >
        <div className="component-content">
          <div className="field-promoicon">
            <JssImage field={props.fields.PromoIcon} cdp-field="PromoIcon" />
          </div>
          <div className="promo-text">
            <div>
              <div className="field-promotext">
                <JssRichText field={props.fields.PromoText} cdp-field="PromoText" />
              </div>
            </div>
            <div className="field-promolink">
              <JssLink field={props.fields.PromoLink} cdp-field="PromoLink" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <PromoDefaultComponent {...props} />;
};

export const WithText = (props: PromoProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  if (props.fields) {
    return (
      <div
        className={`component promo ${props.params.styles}`}
        id={id ? id : undefined}
        cdp-container={`${props.rendering.uid}`}
      >
        <div className="component-content">
          <div className="field-promoicon">
            <JssImage field={props.fields.PromoIcon} cdp-field="PromoIcon" />
          </div>
          <div className="promo-text">
            <div>
              <div className="field-promotext">
                <JssRichText
                  className="promo-text"
                  field={props.fields.PromoText}
                  cdp-field="PromoText"
                />
              </div>
            </div>
            <div className="field-promotext">
              <JssRichText
                className="promo-text"
                field={props.fields.PromoText2}
                cdp-field="PromoText2"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <PromoDefaultComponent {...props} />;
};
