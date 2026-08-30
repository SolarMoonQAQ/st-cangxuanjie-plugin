export type SpeakerProfile = {
    avatar: string
}

export const speakerProfiles: Record<string, SpeakerProfile> = {
    沈慕微: {
        avatar: 'https://i.postimg.cc/Nf4V2XhJ/1_2_artist_shion(mirudakemann)_0_6_artist_ciloranko_0_8_artist_kushima_yu_s_1265307928.png',
    },
    江念: {
        avatar: 'https://i.postimg.cc/7ZZR3LDK/1_2_artist_shion(mirudakemann)_0_6_artist_ciloranko_0_8_artist_kushima_yu_s_1259744848.png',
    },
    冷小凝: {
        avatar: 'https://i.postimg.cc/9QQkdfVx/1_2_artist_shion(mirudakemann)_0_6_artist_ciloranko_0_8_artist_kushima_yu_s_295505417.png',
    },
    印唯心: {
        avatar: 'https://i.postimg.cc/Njjn60Bw/1_2_artist_shion(mirudakemann)_0_6_artist_ciloranko_0_8_artist_kushima_yu_s_2867104877.png',
    },
    妖九烟: {
        avatar: 'https://i.postimg.cc/fRRPcbZq/1_2_artist_shion(mirudakemann)_0_6_artist_ciloranko_0_8_artist_kushima_yu_s_1721347458.png',
    },
    药芷若: {
        avatar: 'https://i.postimg.cc/8zzYRCNQ/1_2_artist_shion(mirudakemann)_0_6_artist_ciloranko_0_8_artist_kushima_yu_s_2591833600.png',
    },
    慕海棠: {
        avatar: 'https://i.postimg.cc/FHH6yKmn/1_2_artist_shion(mirudakemann)_0_6_artist_ciloranko_0_8_artist_kushima_yu_s_1704310586.png',
    },
    欧阳诚: {
        avatar: 'https://i.postimg.cc/nck59m80/1_2_artist_shion(mirudakemann)_0_6_artist_ciloranko_0_8_artist_kushima_yu_s_3493388499.png',
    },
    叶段英: {
        avatar: 'https://i.postimg.cc/c4mjt3qM/1_2_artist_shion(mirudakemann)_0_6_artist_ciloranko_0_8_artist_kushima_yu_s_813824879.png',
    },
    谢忘生: {
        avatar: 'https://i.postimg.cc/650S4ZsV/1-2-artist-shion(mirudakemann)-0-6-artist-ciloranko-0-8-artist-kushima-yu-s-2576050650.png',
    },
    萧天衍: {
        avatar: 'https://i.postimg.cc/Bnff9FWK/1-2-artist-shion(mirudakemann)-0-6-artist-ciloranko-0-8-artist-kushima-yu-s-736807161.png',
    },
    颂长风: {
        avatar: 'https://i.postimg.cc/vHzjxnR5/1_2_artist_shion(mirudakemann)_0_6_artist_ciloranko_0_8_artist_kushima_yu_s_1247479660.png',
    },
    阎冥: {
        avatar: 'https://i.postimg.cc/m2wq19xM/1_2_artist_shion(mirudakemann)_0_6_artist_ciloranko_0_8_artist_kushima_yu_s_3235198407.png',
    },
    姜昭昭: {
        avatar: 'https://i.postimg.cc/43NsCNTh/1_2_artist_shion(mirudakemann)_0_6_artist_ciloranko_0_8_artist_kushima_yu_s_1559030753.png',
    },
    苏酒儿: {
        avatar: 'https://i.postimg.cc/7LYwvYy7/1_2_artist_shion(mirudakemann)_0_6_artist_ciloranko_0_8_artist_kushima_yu_s_1743935713.png',
    },
    姜澄鸢: {
        avatar: 'https://i.postimg.cc/g0km9kPh/1_2_artist_shion(mirudakemann)_0_6_artist_ciloranko_0_8_artist_kushima_yu_s_1742317145.png',
    },
    红: {
        avatar: 'https://pub-0b945c39f816498d833c1a7e27007410.r2.dev/红头像.png',
    },
    潮听澜: {
        avatar: 'https://pub-0b945c39f816498d833c1a7e27007410.r2.dev/潮听澜头像.png',
    },
    雪照宁: {
        avatar: 'https://pub-0b945c39f816498d833c1a7e27007410.r2.dev/雪照宁头像.png',
    },
    小索: {
        avatar: 'https://pub-0b945c39f816498d833c1a7e27007410.r2.dev/小索头像.png',
    },
    凌长霜: {
        avatar: 'https://pub-0b945c39f816498d833c1a7e27007410.r2.dev/凌长霜头像.png',
    },
    银摇枝: {
        avatar: 'https://pub-0b945c39f816498d833c1a7e27007410.r2.dev/银摇枝头像.png',
    },
}

const defaultProfile: SpeakerProfile = {
    avatar: 'https://github.com/shadcn.png',
}

export function getSpeakerProfile(speaker: string): SpeakerProfile {
    return speakerProfiles[speaker.trim()] ?? defaultProfile
}
