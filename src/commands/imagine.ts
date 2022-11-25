import { CommandType, Plugins, SparkCommand } from '@spark.ts/handler';
import { ApplicationCommandOptionType, AttachmentBuilder } from 'discord.js';
import { openai } from '../util/openai.js';

export default new SparkCommand({
  type: CommandType.Slash,
  options: [
    {
      name: 'prompt',
      description: 'the prompt for the ai generation',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  plugins: [Plugins.Publish()],
  async run({ interaction, args }) {
    const prompt = args.getString('prompt')!;

    await interaction.deferReply();

    const completion = await openai.createImage({
      prompt,
      n: 1,
      size: '1024x1024',
    });

    const imageUrl = completion.data.data[0]?.url!;

    const image = new AttachmentBuilder(imageUrl, { name: 'image.png' });

    interaction.followUp({ files: [image] });
  }
});
