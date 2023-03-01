import React from 'react';
import MyHtmlComponent from './MyHtmlComponent';

export class ImprimeTexto extends React.Component {
    render() {
      let texto = this.props.textoInteiro;
  
      let textoFinal = texto.map((el: any) => {
          if(typeof el === 'string') {
             let elemento = el.replaceAll('</word>', ''); // limpa elementos sujos
             return elemento;
          } else {
            return el;
          }
      })
      return <div key="1">{textoFinal}</div>;
    }
  }