import inquirer from 'inquirer';
import { emailQuestion, passwordQuestion } from '../utils/questions';
import { print } from '../utils/log';
import { authenticateUser } from '../services/auth/auth-service';
import { CoreProvider } from '../services/state/CoreProvider';
import { handleError } from '../utils/error-handler';
import { getRememberMe, saveEmail, saveId } from '../utils/persistence';
import { waitWithMessage } from '../utils/general';

export const loginView = async () => {
	try {
		print('HackerChat Login');
		const { email, password } = await inquirer.prompt([
			emailQuestion,
			passwordQuestion
		]);
		const authenticationResponse = await authenticateUser({ email, password });
		if (authenticationResponse.user) {
			CoreProvider.instance.setUserId(authenticationResponse.user.uid);
			CoreProvider.instance.setUserEmail(email);
			const rememberMe = getRememberMe();
			if (rememberMe) {
				saveId(authenticationResponse.user.uid);
				saveEmail(email);
			}
		}
		return;
	} catch (error) {
		handleError(error);
		await waitWithMessage('Ok');
		return;
	}
};
