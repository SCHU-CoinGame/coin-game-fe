import { css } from '@emotion/react';
import { Button, Form, Input } from 'antd';
import { requestSignin } from 'api/requests/requestAuth';
import { useNavigate } from 'react-router-dom';
import { colorLight } from 'styles/colors';
import { useUserInfoStore } from 'stores/userInfoStore';
import { useMutation } from '@tanstack/react-query';
import { getUpbitData } from 'api/requests/requestCoin';
import { transformCoinData } from 'views/CoinConverter';
import { useCoinListStore } from 'stores/userInfoStore';

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
  flex-direction: row;
  gap: 10px;
`;

const startBtnCss = css`
  width: 120px;
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
  department: string;
  student_id: number;
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
  const navigate = useNavigate();

  const handleRank = () => {
    navigate('/rank');
  };

  const onFinish = (values: any) => {
    upbitData.mutate();
    console.log(values);
    useUserInfoStore.getState().changeUserInfo(values);
    requestSignin();
    navigate('/');
  };

  return (
    <div css={containerCss}>
      <div css={titleCss}>코인예측왕</div>
      <Form onFinish={onFinish}>
        <Form.Item<FieldType>
          name="name"
          rules={[{ required: true, message: '이름을 입력해주세요.' }]}
        >
          <Input css={inputCss} placeholder="이름" />
        </Form.Item>
        <Form.Item<FieldType>
          name="department"
          rules={[{ required: true, message: '학과를 입력해주세요.' }]}
        >
          <Input css={inputCss} placeholder="학과" />
        </Form.Item>
        <Form.Item<FieldType>
          name="student_id"
          rules={[{ required: true, message: '학번을 입력해주세요.' }]}
        >
          <Input css={inputCss} placeholder="학번" />
        </Form.Item>
        <Form.Item<FieldType> name="nickname">
          <Input css={inputCss} placeholder="별명" />
        </Form.Item>
        {/* <div>별명 미작성 시, 랭킹에 이름으로 등록됩니다</div> */}
        <div css={btnContainerCss}>
          <Button css={rankBtnCss} onClick={handleRank}>
            랭킹 확인
          </Button>
          <Button type="primary" htmlType="submit" css={startBtnCss}>
            게임 시작
          </Button>
        </div>
      </Form>
    </div>
  );
}

export { SigninPanel };
