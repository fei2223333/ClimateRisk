import React from 'react';
import { shallow } from 'enzyme';
import { SpineContent } from '../../../src/features/home/SpineContent';

describe('home/SpineContent', () => {
  it('renders node with correct class name', () => {
    const props = {
      home: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <SpineContent {...props} />
    );

    expect(
      renderedComponent.find('.home-spine-content').length
    ).toBe(1);
  });
});
