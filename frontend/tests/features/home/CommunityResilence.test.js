import React from 'react';
import { shallow } from 'enzyme';
import { CommunityResilence } from '../../../src/features/home/CommunityResilenceLayout';

describe('home/CommunityResilence', () => {
  it('renders node with correct class name', () => {
    const props = {
      home: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <CommunityResilence {...props} />
    );

    expect(
      renderedComponent.find('.home-community-resilence-layout').length
    ).toBe(1);
  });
});
