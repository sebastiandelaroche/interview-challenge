export interface UseCase<Input, Output = void> {
  execute(input: Input): Promise<Output>;
}
