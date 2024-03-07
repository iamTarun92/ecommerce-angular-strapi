import type { Schema, Attribute } from '@strapi/strapi';

export interface FormAddress extends Schema.Component {
  collectionName: 'components_form_addresses';
  info: {
    displayName: 'address';
    description: '';
  };
  attributes: {
    fullName: Attribute.String;
    phone: Attribute.String;
    address: Attribute.Text;
    city: Attribute.String;
    state: Attribute.String;
    zip: Attribute.String;
    type: Attribute.String;
    primary: Attribute.Boolean;
  };
}

export interface SharedCity extends Schema.Component {
  collectionName: 'components_shared_cities';
  info: {
    displayName: 'city';
  };
  attributes: {
    city: Attribute.Enumeration<
      ['city-1', 'city-2', 'city-3', 'city-4', 'city-5']
    >;
  };
}

export interface SharedState extends Schema.Component {
  collectionName: 'components_shared_states';
  info: {
    displayName: 'state';
  };
  attributes: {
    state: Attribute.Enumeration<
      ['state-1', 'state-2', 'state-3', 'state-4', 'state-5']
    >;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'form.address': FormAddress;
      'shared.city': SharedCity;
      'shared.state': SharedState;
    }
  }
}
