import { CommandType, Plugins, SparkCommand } from '@spark.ts/handler';
import { ApplicationCommandOptionType, AttachmentBuilder, EmbedBuilder } from 'discord.js';
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
  async run({ client, interaction, args }) {
    const prompt = args.getString('prompt')!;

    await interaction.deferReply();

    try {
      const completion = await openai.createImage({
        prompt,
        n: 1,
        size: '1024x1024',
      });

      const imageUrl = completion.data.data[0]?.url!;

      const image = new AttachmentBuilder(imageUrl, { name: 'image.png' });

      return interaction.followUp({ files: [image] });
    } catch (e) {
      const embed = new EmbedBuilder()
        .setTitle('❌ Error')
        .setColor('Red')
        .setDescription(`There was an error creating your image.\n\`\`\`${e}\`\`\``);

      client.logger.error(e);
      return interaction.followUp({ embeds: [embed] });
    }
  }
});
