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
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      .wrapper {
        padding: 10px 16px;
        margin: 4px 0;
        border-radius: 5px;
        background-color: #fff;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        transition: background-color 0.3s ease, box-shadow 0.3s ease;
        display: flex;
        align-items: center;
        gap: 16px;
        cursor: pointer;
      }
      :host(:hover) .wrapper {
        background-color: #e8e8e8; /* Subtle hover effect */
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
      }
      h3 {
        font-size: 1.1rem;
        font-weight: bold;
        margin: 0;
        color: #333;
      }
      p {
        font-size: 0.9rem;
        color: #666;
        margin: 2px 0 0 0;
      }
      .index {
        font-size: 0.9rem;
        color: #555;
        background-color: #ddd;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 10px;
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
