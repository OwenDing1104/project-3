// tv-channel.js
import { LitElement, html, css } from 'lit';

export class TvChannel extends LitElement {
  static get properties() {
    return {
      title: { type: String },
      presenter: { type: String },
      index: { type: Number },
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        margin-bottom: 10px;
        position: relative;
      }
      .wrapper {
        padding: 16px;
        border-radius: 5px;
        background-color: white;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        gap: 16px;
      }
      :host::before {
        content: var(--index);
        position: absolute;
        left: -36px; 
        top: 50%;
        transform: translateY(-50%);
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background-color: blue;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: bold;
      }
      h3, h4 {
        margin: 0;
      }
    `;
  }

  render() {
    return html`
      <div class="wrapper" style="--index: '${this.index}';">
        <h3>${this.title}</h3>
      </div>
    `;
  }
}

customElements.define('tv-channel', TvChannel);
