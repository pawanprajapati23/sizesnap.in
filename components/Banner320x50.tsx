"use client";

export default function Banner320x50() {
  return (
    <div className="flex justify-center w-full my-4 overflow-hidden min-h-[50px]">
      <iframe
        title="Adsterra 320x50"
        src="about:blank"
        width="320"
        height="50"
        frameBorder="0"
        scrolling="no"
        onLoad={(e) => {
          const doc = (e.target as HTMLIFrameElement).contentDocument;
          if (doc) {
            doc.open();
            doc.write(`
              <html>
                <body style="margin:0;padding:0;background:transparent;">
                  <script type="text/javascript">
                    atOptions = {
                      'key' : 'f509bd7d24a58ce7a176067713ca61df',
                      'format' : 'iframe',
                      'height' : 50,
                      'width' : 320,
                      'params' : {}
                    };
                  </script>
                  <script type="text/javascript" src="https://www.highperformanceformat.com/f509bd7d24a58ce7a176067713ca61df/invoke.js"></script>
                </body>
              </html>
            `);
            doc.close();
          }
        }}
      />
    </div>
  );
}
