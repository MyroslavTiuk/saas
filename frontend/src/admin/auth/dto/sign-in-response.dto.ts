export class SignInResponseDto {
  id: number;
  access_token: string;
  refresh_token: string;
  expire_in: number;
  token_type: string;
}
