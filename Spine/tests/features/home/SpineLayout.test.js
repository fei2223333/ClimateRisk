import React from 'react';
import { shallow } from 'enzyme';
import { SpineLayout } from '../../../src/features/home/SpineLayout';

describe('home/SpineLayout', () => {
  it('renders node with correct class name', () => {
    const props = {
      home: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <SpineLayout {...props} />
    );

    expect(
      renderedComponent.find('.home-spine-layout').length
    ).toBe(1);
  });
});
