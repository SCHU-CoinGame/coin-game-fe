import { css } from '@emotion/react';

const globalCss = css`
  @font-face {
    font-family: 'SpoqaHanSansNeo-Regular';
    font-style: normal;
    src: url('/assets/SpoqaHanSansNeo-Regular.woff2') format('woff2');
  }
  @font-face {
    font-family: 'SpoqaHanSansNeo-Medium';
    font-style: normal;
    src: url('/assets/SpoqaHanSansNeo-Medium.woff2') format('woff2');
  }
  @font-face {
    font-family: 'SpoqaHanSansNeo-Bold';
    font-style: normal;
    src: url('/assets/SpoqaHanSansNeo-Bold.woff2') format('woff2');
  }
  @font-face {
    font-family: 'GmarketSans-Medium';
    src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2001@1.1/GmarketSansMedium.woff')
      format('woff');
    font-weight: normal;
    font-style: normal;
  }
  * {
    box-sizing: border-box; // padding 사이즈 포함하여 width, height 계산
    margin: 0;
    padding: 0;
    font-family: 'SpoqaHanSansNeo-Medium';
  }
`;

export { globalCss };
