import React from 'react';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { WhiteBlock } from '../../WhiteBlock';
import { StepInfo } from '../../StepInfo';
import { Axios } from '../../../core/axios';

import styles from './EnterPhoneStep.module.scss';
import { MainContext } from '../../../pages';

export const EnterCodeStep = () => {
  const router = useRouter();
  const { userData } = React.useContext(MainContext);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [codes, setCodes] = React.useState(['', '', '', '']);

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const index = Number(event.target.getAttribute('id')); // тут мы получаем индекс инпута по его id (0, 1, 2, 3) и приводим его к числу (Number) т.к. по умолчанию это строка (String)  
    const value = event.target.value;
    setCodes((prev) => {
      const newArr = [...prev]; // создаем копию массива codes (prev) и записываем ее в newArr 
      newArr[index] = value;
      return newArr;
    });
    if (event.target.nextSibling) {
      (event.target.nextSibling as HTMLInputElement).focus(); // переводим фокус на следующий инпут (если он есть) 
    } else {
      onSubmit([...codes, value].join(''));
    }
  };

  const onSubmit = async (code: string) => {
    try {
      setIsLoading(true);
      await Axios.post(`/auth/sms/activate`, {
        code,
        user: userData,
      });
      router.push('/rooms'); // переходим на страницу rooms 
    } catch (error) {
      alert('Activation error!');
      setCodes(['', '', '', '']);
    }

    setIsLoading(false);
  };

  return (
    <div className={styles.block}>
      {!isLoading ? (
        <>
          <StepInfo icon="/static/numbers.png" title="Enter your activate code" />
          <WhiteBlock className={clsx('m-auto mt-30', styles.whiteBlock)}>
            <div className={styles.codeInput}>
              {codes.map((code, index) => (
                <input
                  key={index}
                  type="tel"
                  placeholder="X"
                  maxLength={1}
                  id={String(index)}
                  onChange={handleChangeInput}
                  value={code}
                />
              ))}
            </div>
          </WhiteBlock>
        </>
      ) : (
        <div className="text-center">
          <div className="loader"></div>
          <h3 className="mt-5">Activation in progress ...</h3>
        </div>
      )}
    </div>
  );
};
