import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { studentTheme, teacherTheme } from '../styles/colors';

export function useTheme() {
  const { user } = useContext(UserContext);
  return user?.role === 'teacher' ? teacherTheme : studentTheme;
}
