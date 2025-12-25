// prettier-ignore
import { ImageResponse } from 'next/og';
import { Globe, MapPin } from 'lucide-react';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || 'Portfolio';
  const description = searchParams.get('description') || 'FOSS, ASOP and Linux Enthusiast.';

  return new ImageResponse(
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#0a0a0a',
        color: '#fff',
        padding: '80px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        justifyContent: 'space-between',
        backgroundImage: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
      }}
    >
      {/* TOP SECTION */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '40px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', flex: 1 }}>
          {/* NAME & USERNAME */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div
              style={{
                fontSize: 72,
                fontWeight: 900,
                letterSpacing: '-0.02em',
                background: 'linear-gradient(135deg, #ffffff 0%, #a0a0a0 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Maverick
            </div>
            <div style={{ fontSize: 20, color: '#888', fontWeight: 500, letterSpacing: '0.05em' }}>
              @mqverk
            </div>
          </div>

          {/* BIO */}
          <div
            style={{
              fontSize: 28,
              color: '#d0d0d0',
              lineHeight: 1.5,
              fontWeight: 500,
              maxWidth: '90%',
            }}
          >
            {description}
          </div>

          {/* DETAILS - Using SVG icons */}
          <div
            style={{
              display: 'flex',
              gap: '32px',
              marginTop: '8px',
            }}
          >
            {/* Portfolio Link */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                <path d="M2 12h20" />
              </svg>
              <div style={{ fontSize: 18, color: '#a0a0a0', fontWeight: 500 }}>mqverk.me</div>
            </div>

            {/* Location */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <div style={{ fontSize: 18, color: '#a0a0a0', fontWeight: 500 }}>India</div>
            </div>
          </div>
        </div>

        {/* AVATAR */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              position: 'relative',
              width: 200,
              height: 200,
              borderRadius: '50%',
              background:
                'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
              border: '2px solid rgba(255,255,255,0.2)',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            }}
          >
            <img
              src="https://avatars.githubusercontent.com/u/189636445?s=400&u=df6e29aa5ca88c19c5e125c310eb70c7f7f33478&v=4"
              width={200}
              height={200}
              alt="Maverick Avatar"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>
        </div>
      </div>

      {/* DIVIDER */}
      <div
        style={{
          height: '1px',
          background:
            'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
          margin: '32px 0',
        }}
      />

      {/* BOTTOM SECTION WITH DYNAMIC TITLE */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#fff',
              boxShadow: '0 0 12px rgba(255,255,255,0.8)',
            }}
          />
          <div
            style={{
              fontSize: 18,
              color: '#888',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
            }}
          >
            Current Page
          </div>
        </div>

        <div
          style={{
            fontSize: 36,
            fontWeight: 800,
            color: '#000',
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
            border: '2px solid rgba(255,255,255,0.4)',
            padding: '16px 40px',
            borderRadius: '9999px',
            boxShadow: '0 10px 40px rgba(255,255,255,0.1)',
          }}
        >
          {title}
        </div>
      </div>
    </div>,
    { width: 1200, height: 630 }
  );
}
