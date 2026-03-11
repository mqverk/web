export interface ProfileData {
    name: string;
    rotatingTitles: string[];
    bio: string;
    socials: {
        github: string;
        linkedin: string;
        email: string;
    };
}

export interface TimelineItem {
    id: number;
    role: string;
    company: string;
    date: string;
    description: string;
    type: string;
}

export interface ProjectData {
    id: string;
    title: string;
    description: string;
    link: string;
}
