import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '@/src/core/prisma/prisma.service';
import { StorageService } from '@/src/modules/libs/storage/storage.service';
import { User } from '@prisma/generated/client';
import { FileUpload } from 'graphql-upload-ts';
import sharp from 'sharp';
import type { ChangeProfileInfoInput } from '@/src/modules/auth/profile/inputs/change-info.input';

@Injectable()
export class ProfileService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly storageService: StorageService,
  ) {}

  async changeAvatar(user: User, avatar: Promise<FileUpload>) {
    const file = await avatar;

    if (user.avatar) {
      await this.storageService.delete(user.avatar);
    }

    const chunks: Buffer[] = [];

    for await (const chunk of file.createReadStream()) {
      chunks.push(chunk as Buffer);
    }

    const buffer = Buffer.concat(chunks);
    const fileName = `/channels/${user.username}.webp`;

    const isGif = file.filename?.endsWith('.gif');

    const processedBuffer = await sharp(buffer, { animated: isGif })
      .resize(512, 512)
      .webp()
      .toBuffer();

    await this.storageService.upload(processedBuffer, fileName, 'image/webp');

    await this.prismaService.user.update({
      where: { id: user.id },
      data: { avatar: fileName },
    });

    return true;
  }

  async removeAvatar(user: User) {
    if (!user.avatar) {
      return true;
    }

    await this.storageService.delete(user.avatar);

    await this.prismaService.user.update({
      where: { id: user.id },
      data: { avatar: null },
    });

    return true;
  }

  async changeProfileInfo(user: User, input: ChangeProfileInfoInput) {
    const { username, name, bio } = input;

    const existingUsername = await this.prismaService.user.findUnique({
      where: { username },
    });

    if (existingUsername) {
      throw new ConflictException('Username already exists');
    }

    await this.prismaService.user.update({
      where: { id: user.id },
      data: { username, name, bio },
    });

    return true;
  }
}
