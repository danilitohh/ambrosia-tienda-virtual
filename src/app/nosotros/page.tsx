'use client';
import Image from "next/image";

export default function Nosotros() {
  return (
    <div className="min-h-screen bg-black py-16">
      <div className="max-w-3xl mx-auto px-4">
        <button
          onClick={() => window.location.href = '/'}
          className="mb-8 bg-[#C6FF00] hover:bg-[#b2e600] text-black font-semibold px-6 py-2 rounded-lg transition-colors"
        >
          ← Volver al inicio
        </button>
        <h2 className="text-3xl font-bold mb-10 text-center text-[#C6FF00]">Nosotros</h2>
        <h3 className="text-2xl md:text-3xl font-bold mb-6 text-center text-[#C6FF00]">✨ ¿Qué significa Ambrosia Bhang?</h3>
        <p className="text-white mb-4"><b>Ambrosia</b>, en la mitología griega, es el alimento de los dioses. Algo que nutre no solo el cuerpo, sino también el alma.</p>
        <p className="text-white mb-4"><b>Bhang</b>, por otro lado, es una preparación ancestral de cannabis utilizada en la India con fines ceremoniales y espirituales. Se usaba para conectar con planos más elevados de percepción.</p>
        <p className="text-white mb-8"><b>Juntas, estas dos palabras representan la esencia de nuestra marca:</b> ofrecer experiencias sagradas y significativas a través de productos conscientes como el té de cannabis y los Happy Brownies.</p>
        <h3 className="text-xl font-bold mb-2 mt-8" style={{ color: '#C6FF00' }}>🎯 Objetivo de la marca</h3>
        <p className="text-white mb-4">En <b>Ambrosia Bhang</b> queremos recordarte que <b>menos es más</b>, y que <b>consumir con consciencia</b> es el verdadero camino hacia el bienestar y la expansión personal.<br/>Nuestros productos no son solo recreativos, <b>son herramientas para imaginar, sentir y crear</b>.</p>
        <h3 className="text-xl font-bold mb-2 mt-8" style={{ color: '#C6FF00' }}>🌀 El viaje consciente</h3>
        <p className="text-white mb-2">Nuestros <b>Happy Brownies</b> no son solo un dulce, son una puerta hacia una experiencia transformadora:</p>
        <ul className="list-disc list-inside text-white mb-4">
          <li><b>Imaginar:</b> Intencionar el viaje, visualizar el espacio y el propósito.</li>
          <li><b>Sentir:</b> Escuchar al cuerpo y las emociones con apertura.</li>
          <li><b>Crear:</b> Transformar lo vivido en arte, escritura, o simplemente una nueva visión de ti misma.</li>
        </ul>
        <p className="text-white mb-8">Un mordisco, una pausa, y el viaje comienza.</p>
        <h3 className="text-xl font-bold mb-2 mt-8" style={{ color: '#C6FF00' }}>🌱 Misión</h3>
        <p className="text-white mb-8">Ofrecer experiencias conscientes a través de productos cannábicos que inviten al autoconocimiento, la expansión creativa y la conexión interna, promoviendo siempre el consumo responsable y ritualizado.</p>
        <h3 className="text-xl font-bold mb-2 mt-8" style={{ color: '#C6FF00' }}>🌈 Visión</h3>
        <p className="text-white">Crear una comunidad donde el cannabis se viva con respeto, sabiduría y arte. Que cada té y cada brownie sea un recordatorio de que la verdadera magia está en cómo elegimos vivir la experiencia.</p>
        <div className="mt-12 p-6 bg-[#23272a] rounded-lg text-center border border-[#C6FF00]">
          <h3 className="text-xl font-bold mb-2" style={{ color: '#C6FF00' }}>📞 Contacto</h3>
          <p className="text-white mb-2">¿Tienes dudas o quieres hacer un pedido?</p>
          <a
            href="https://wa.me/573235924705"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#C6FF00] hover:bg-[#b2e600] text-black font-bold py-2 px-6 rounded-lg transition-colors text-lg"
          >
            WhatsApp: 323 5924705
          </a>
        </div>
      </div>
    </div>
  );
} 