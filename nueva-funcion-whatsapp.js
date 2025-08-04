  const enviarMensajeWhatsApp = async () => {
    // Generar el mensaje completo con formato compatible para WhatsApp
    const mensaje = `Hola! Aqui esta mi pedido completo:

*** MI PEDIDO ESPECIAL ***
PRODUCTOS SELECCIONADOS:
${items.map(item => {
  let nombre = item.name;
  if (nombre.toLowerCase().includes('brownie')) {
    nombre = nombre.replace(/chocolate/gi, '').replace(/\s+/g, ' ').trim();
  }
  let cantidad = '';
  if (/de x\d+/i.test(nombre)) {
    cantidad = '';
  } else if (nombre.toLowerCase().includes('brownie')) {
    cantidad = item.quantity > 1 ? `combo (x${item.quantity})` : 'x1';
  } else if (nombre.toLowerCase().includes('galleta')) {
    cantidad = 'combo (x6)';
  } else if (nombre.toLowerCase().includes('trufa')) {
    cantidad = 'combo (x6)';
  } else if (nombre.toLowerCase().includes('chocolate')) {
    cantidad = 'combo (x8)';
  } else {
    cantidad = `x${item.quantity}`;
  }
  let categoria = '[DULCE]';
  if (nombre.toLowerCase().includes('brownie')) categoria = '[BROWNIE]';
  if (nombre.toLowerCase().includes('galleta')) categoria = '[GALLETA]';
  if (nombre.toLowerCase().includes('trufa')) categoria = '[TRUFA]';
  if (nombre.toLowerCase().includes('chocolate')) categoria = '[CHOCOLATE]';
  if (nombre.toLowerCase().includes('postre')) categoria = '[POSTRE]';
  return `- ${categoria} ${nombre}${cantidad ? ' ' + cantidad : ''} - $${(item.price * item.quantity).toLocaleString('es-CO')}`;
}).join('\n')}

${appliedPromoCode ? `*** DESCUENTO APLICADO ***
${appliedPromoCode.code} (-$${discount.toLocaleString('es-CO')})` : ''}

${propina > 0 ? `*** PROPINA ***
Propina para el equipo: $${propina.toLocaleString('es-CO')}` : ''}

*** TOTAL A PAGAR ***
$${(total + propina).toLocaleString('es-CO')}

*** DATOS DEL PEDIDO ***
Numero de orden: ${orderId}

Gracias por elegirnos!`;

    // Crear la URL de WhatsApp con el mensaje prellenado
    const urlWhatsApp = `https://wa.me/${WHATSAPP_NUM}?text=${encodeURIComponent(mensaje)}`;
    
    // Abrir WhatsApp directamente
    window.open(urlWhatsApp, '_blank');
  };
