
const currentYear = new Date().getFullYear().toString();
const appUrl = process.env.NEXT_PUBLIC_APP_URL;
const bucketEndPoint = process.env.NEXT_PUBLIC_S3_ENDPOINT;
const bucketName = process.env.NEXT_PUBLIC_S3_BUCKET_NAME;

export const forgotPasswordTeamplate = (token: string) => {
    return `
        <html>
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<style>
					body {font-family: Arial, sans-serif;}
				</style>
			</head>
			<body>
				<div>
					<table align="center" style="width: 100%; max-width: 600px; background-color: transparent;">
						<tbody>
							<tr>
								<td align="center" style="padding: 0;">
									<table style="width: 100%; background-color: transparent;">
										<tbody>
											<tr>
												<td style="padding: 48px 24px 16px 24px; text-align: center;">
													<a href="${appUrl}" style="text-decoration: none; color: #0070F3;">
														<img src="${bucketEndPoint + '/' + bucketName}/main/logo.svg" width="120" style="height: auto; border: none;" />
													</a>
												</td>
											</tr>
											<tr>
												<td style="padding: 8px 24px 16px 24px; text-align: center;">
													<h1 style="font-size: 32px; font-weight: 600; color: #000000;">Şifre Yenileme</h1>
												</td>
											</tr>
											<tr>
												<td style="padding: 8px 24px 8px 24px; text-align: left;">
													<p style="font-size: 16px; color: #666666; line-height: 1.5;">Hesabınıza ait şifrenizi sıfırlamak için bir talep aldık.</p>
													<p style="font-size: 16px; color: #666666; line-height: 1.5;">Eğer bu isteği siz yapmadıysanız, bu e-postayı dikkate almayın.</p>
												</td>
											</tr>
											<tr>
												<td style="padding: 24px 12px; text-align: center;">
													<a href="${appUrl + '/reset-password/' + token}" style="display: inline-block; background-color: #000000; color: #ffffff; font-size: 16px; padding: 16px 20px; border-radius: 80px; text-decoration: none;">
														Yeni Şifre Oluştur
													</a>
												</td>
											</tr>
											<tr>
												<td style="padding: 7px 24px 16px 24px; text-align: center;">
													<hr style="border-top: 1px solid #80808033;" />
												</td>
											</tr>
											<tr>
												<td style="padding: 10px; text-align: center;">
													<p style="font-size: 12px; color: #454545;">
														Maslak Mahalesi, Taşyoncası Sokak, No: 1V ve No: 1Y Sarıyer - İstanbul
														<br />
														Copyright © ${currentYear} Istanbul Nisantasi University. All rights reserved.
													</p>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</body>
		</html>`;
}