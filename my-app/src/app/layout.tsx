import React from "react";
import { Noto_Sans_Thai } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import { Providers } from "@/components/SessionProvider";
import './globals.css'

const fontThai = Noto_Sans_Thai({ subsets: ["thai"] });

const RootLayout = ({ children }: React.PropsWithChildren) => (
  <html lang="en">
    <body>
      <AntdRegistry>
        <Providers>
          <ConfigProvider
            theme={{ token: { fontFamily: fontThai.style.fontFamily } }}
          >
            {children}
          </ConfigProvider>
        </Providers>
      </AntdRegistry>
    </body>
  </html>
);

export default RootLayout;
