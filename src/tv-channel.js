// tv-channel.js
import { LitElement, html, css } from 'lit';

export class TvChannel extends LitElement {
  static get properties() {
    return {
      title: { type: String },
      presenter: { type: String }, // Keep this if you plan to use it
      index: { type: Number },
      description: { type: String },
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        margin-bottom: 10px;
        cursor: pointer;
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
      :host(:hover) .wrapper {
        background-color: #f0f0f0; /* Highlight on hover */
      }
      h3 {
        margin: 0;
      }
      .index {
        font-size: 0.8em;
        color: #555;
      }
    `;
  }

  render() {
    return html`
      <div class="wrapper">
        <span class="index">${this.index}.</span>
        <div>
          <h3>${this.title}</h3>
          <p>${this.description}</p>
        </div>
      </div>
    `;
  }  
}

customElements.define('tv-channel', TvChannel);
