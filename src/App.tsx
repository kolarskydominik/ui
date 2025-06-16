import { DkCarousel } from './components/dk-carousel';

const App = () => {
  return (
    <>
      <main className="min-h-svh overflow-x-hidden overflow-y-auto bg-neutral-800 px-10!">
        <DkCarousel
          items={Array.from({ length: 10 }).map((_, i) => (
            <div key={i}>
              <CanvasPlaceholder />
            </div>
          ))}
          perView={2}
          gap={16}
        />
      </main>
    </>
  );
};

export default App;

export function CanvasPlaceholder() {
  const title = 'Run project to view carousel content';
  const subtitle =
    'Collection List content is not accessible to the carousel component in the editor. Run your project or visit the live website to view the carousel with CMS content.';

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        placeContent: 'center',
        placeItems: 'center',
        flexDirection: 'column',
        backgroundColor: 'rgba(136, 85, 255, 0.1)',
        borderRadius: 6,
        border: '1px dashed rgb(136, 85, 255)',
        color: 'rgb(136, 85, 255)',
        fontSize: 12,
        padding: 24,
      }}
    >
      <p
        style={{
          margin: 0,
          marginBottom: 10,
          fontWeight: 600,
          textAlign: 'center',
        }}
      >
        {title}
      </p>
      <p
        style={{
          margin: 0,
          opacity: 0.7,
          maxWidth: 500,
          lineHeight: 1.5,
          textAlign: 'center',
        }}
      >
        {subtitle}
      </p>
    </div>
  );
}
