import React from 'react';
import {
  ComponentRendering,
  Field,
  RichText as JssRichText,
} from '@sitecore-jss/sitecore-jss-nextjs';

interface Fields {
  Text: Field<string>;
}

export type RichTextProps = {
  params: { [key: string]: string };
  fields: Fields;
  rendering: ComponentRendering;
};

export const Default = (props: RichTextProps): JSX.Element => {
  const uid = props.rendering.uid;

  const text = props.fields ? (
    <JssRichText field={props.fields.Text} />
  ) : (
    <span className="is-empty-hint">Rich text</span>
  );
  const id = props.params.RenderingIdentifier;

  return (
    <div
      className={`component rich-text ${props.params.styles.trimEnd()}`}
      id={id ? id : undefined}
      cdp-container={`${uid}`}
    >
      <div className="component-content" cdp-field="text">
        {text}
      </div>
    </div>
  );
};
