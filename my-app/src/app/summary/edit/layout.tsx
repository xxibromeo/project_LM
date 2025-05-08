import React from "react";
import { Noto_Sans_Thai } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import { Providers } from "@/components/SessionProvider";

// ✨ เพิ่มตรงนี้
import dayjs from "dayjs";
import "dayjs/locale/th";
dayjs.locale("th");

const fontThai = Noto_Sans_Thai({ subsets: ["thai"] });

const RootLayout = ({ children }: React.PropsWithChildren) => (
  <html lang="th">
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
