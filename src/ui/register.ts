import inquirer from 'inquirer';
import { registerUser } from '../services/auth/auth-service';
import { CoreProvider } from '../services/state/CoreProvider';
import { saveId, saveEmail, getRememberMe } from '../utils/persistence';
import { print } from '../utils/log';
import { emailQuestion, passwordQuestion } from '../utils/questions';

export const registerView = async () => {
	print('HackerChat Registration');
	const { email, password } = await inquirer.prompt([
		emailQuestion,
		passwordQuestion
	]);
	const response = await registerUser({ email, password });
	if (!response.user) throw new Error('User not registered.');
	CoreProvider.instance.setUserId(response.user.uid);
	CoreProvider.instance.setUserEmail(email);
	try {
		const rememberMe = getRememberMe();
		if (rememberMe) {
			saveId(response.user.uid);
			saveEmail(email);
		}
	} catch {}
};
