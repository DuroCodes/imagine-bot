import { CommandType, Plugins, SparkCommand } from '@spark.ts/handler';
import { ApplicationCommandOptionType } from 'discord.js';
import { openai } from '../util/openai.js';

export default new SparkCommand({
  type: CommandType.Slash,
  options: [
    {
      name: 'prompt',
      description: 'the prompt for the ai completion',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  plugins: [Plugins.Publish()],
  async run({ interaction, args }) {
    const prompt = args.getString('prompt')!;

    await interaction.deferReply();

    const completion = await openai.createCompletion({
      model: 'text-davinci-002',
      prompt,
    });

    const text = completion.data.choices[0]?.text!;

    interaction.followUp(text ?? 'No response');
  }
});
