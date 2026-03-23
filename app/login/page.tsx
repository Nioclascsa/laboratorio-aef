import { signIn } from '@/auth';

export default function LoginPage() {
  return (
    <main className="section-page" style={{ minHeight: '80vh', display: 'grid', placeContent: 'center' }}>
      <div className="stacked-panel" style={{ width: 'min(400px, 90vw)', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-heading)', fontSize: '1.8rem' }}>
          Acceso Investigadores
        </h1>
        <form
          action={async (formData) => {
            "use server";
            await signIn("credentials", {
              email: formData.get("email"),
              password: formData.get("password"),
              redirectTo: "/publicaciones",
            });
          }}
          style={{ display: 'grid', gap: '1rem' }}
        >
          <label style={{ display: 'grid', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Correo electrónico</span>
            <input 
              name="email" 
              type="email" 
              required 
              style={{
                padding: '0.6rem',
                borderRadius: '8px',
                border: '1px solid #ccc',
                width: '100%'
              }}
            />
          </label>
          <label style={{ display: 'grid', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Contraseña</span>
            <input 
              name="password" 
              type="password" 
              required 
              style={{
                padding: '0.6rem',
                borderRadius: '8px',
                border: '1px solid #ccc',
                width: '100%'
              }}
            />
          </label>
          <button 
            type="submit"
            style={{
              marginTop: '0.5rem',
              padding: '0.7rem',
              background: 'var(--accent)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </main>
  );
}