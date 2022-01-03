import { Component, ComponentInterface, h, Host, JSX } from '@stencil/core';

@Component({
  tag: 'app-flags',
  styleUrl: 'app-flags.pcss',
  scoped: true,
})
export class AppFlags implements ComponentInterface {
  render(): JSX.Element {
    return (
      <Host>
          <h1>HOLA CRIS</h1>
      </Host>
    );
  }
}
