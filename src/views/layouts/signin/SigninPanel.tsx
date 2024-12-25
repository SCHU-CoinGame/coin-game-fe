import { css } from '@emotion/react';
import { Button, Form, Input } from 'antd';
import { requestSignin } from 'api/requests/requestAuth';
import { useNavigate } from 'react-router-dom';
import { colorLight } from 'styles/colors';
import { useUserInfoStore } from 'stores/userInfoStore';
import { useMutation } from '@tanstack/react-query';
import { getUpbitData } from 'api/requests/requestCoin';
import { transformCoinData } from 'views/CoinConverter';
import { useCoinListStore, useUserClickStreamStore } from 'stores/userInfoStore';
import { useUserAnalysisStore } from 'stores/userInfoStore';
import { getUserAnalysis } from 'api/requests/requestUserData';

const containerCss = css`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  .ant-form-item {
    margin-bottom: 15px;
  }
`;

const titleCss = css`
  font-size: 56px;
  font-family: 'GmarketSans-Medium';
  margin-bottom: 10px;
`;

const inputCss = css`
  width: 250px;
  height: 36px;
`;

const btnContainerCss = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const startBtnCss = css`
  width: 250px;
  height: 40px;
  color: white;
  background-color: ${colorLight.mainBtnColor};
  font-size: 16px;
  font-family: 'GmarketSans-Medium';
`;

const rankBtnCss = css`
  width: 120px;
  height: 40px;
  color: white;
  background-color: ${colorLight.subBtnColor};
  font-size: 16px;
  font-family: 'GmarketSans-Medium';
`;

type FieldType = {
  name: string;
  affiliation: string;
  nickname: string;
};

function SigninPanel() {
  const upbitData = useMutation({
    mutationFn: getUpbitData,
    onSuccess: (data) => {
      const coinList = transformCoinData(data);
      useCoinListStore.getState().changeCoinList(coinList);
    },
    onError: () => {
      console.log('error');
    },
    onMutate: () => {},
  });

  const setUserAnalysis = useUserAnalysisStore((state) => state.setUserAnalysis);
  const userAnalysis = useMutation({
    mutationFn: getUserAnalysis,
    onSuccess: (data) => {
      setUserAnalysis(data);
    },
  });

  const navigate = useNavigate();

  const handleRank = () => {
    navigate('/rank');
  };

  const handleAnalysis = () => {
    navigate('/analysis');
  };

  const onFinish = (values: any) => {
    upbitData.mutate();
    userAnalysis.mutate();
    console.log(values);
    useUserInfoStore.getState().changeUserInfo({ ...values, reTryCount: 2, highScore: 0 });
    useUserClickStreamStore.getState().resetState();
    requestSignin();
    navigate('/');
  };

  return (
    <div css={containerCss}>
      <div css={titleCss}>코인예측왕</div>
      <Form onFinish={onFinish}>
        <Form.Item<FieldType>
          name="name"
          rules={[{ required: true, message: '닉네임을 입력해주세요.' }]}
        >
          <Input css={inputCss} placeholder="닉네임" />
        </Form.Item>
        <Form.Item<FieldType>
          name="affiliation"
          rules={[{ required: true, message: '소속을 입력해주세요.' }]}
        >
          <Input css={inputCss} placeholder="소속" />
        </Form.Item>
        {/* <Form.Item<FieldType>
          name="student_id"
          rules={[{ required: true, message: '학번을 입력해주세요.' }]}
        >
          <Input css={inputCss} placeholder="학번" />
        </Form.Item> */}
        <Form.Item<FieldType> name="nickname">
          <Input css={inputCss} placeholder="이메일" />
        </Form.Item>
         <div>이메일은 필수항목이 아니며, 경품 전달을 위해서 사용됩니다</div>
        <div css={btnContainerCss}>
          <Button type="primary" htmlType="submit" css={startBtnCss}>
            게임 시작
          </Button>
          <div
            css={css`
              display: flex;
              gap: 10px;
            `}
          >
            <Button css={rankBtnCss} onClick={handleRank}>
              랭킹 확인
            </Button>
            <Button css={rankBtnCss} onClick={handleAnalysis}>
              통계 확인
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
}

export { SigninPanel };
