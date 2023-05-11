import { Card, Container, Grid, Typography } from '@mui/material';
import Link from 'next/link';
import type { LayoutFC } from '@/type/GlobalContext';
import { UserLayout } from '@/layout/UserLayout';

const tools = [
  {
    name: 'Video Converter',
    description:
      'Convert video to mp4, webm, mkv, flv, 3gp, gif, avi, wmv, mov, mpeg, mpg, m4v, ogv, ogg, and more.',
    icon: 'https://scrnli.com/static/media/convert.72f8549077f576625a23b196db551253.svg',
    url: '/tools/video-converter',
    target: '_blank',
  },
  {
    name: 'Video Downloader',
    description: 'Download video from YouTube, Facebook, Instagram, Twitter, TikTok, and more.',
    icon: 'https://scrnli.com/static/media/convert.72f8549077f576625a23b196db551253.svg',
    url: '/tools/video-downloader',
  },
  {
    name: 'Bg Remover',
    description: 'Remove background from image.',
    icon: '',
    url: 'https://logs.powerfulyang.com',
  },
  {
    name: 'swagger to code',
    description: 'Convert swagger to code.',
    icon: '',
    url: '/tools/swagger2code',
  },
];

const Tools: LayoutFC = () => {
  return (
    <Container
      maxWidth="xl"
      sx={{
        py: 4,
      }}
    >
      <Grid container wrap="wrap" spacing={4}>
        {tools.map((tool) => {
          return (
            <Grid
              key={tool.name}
              item
              xs={12}
              sm={4}
              className="pointer"
              component={Link}
              href={tool.url}
              target={tool.target}
            >
              <Card
                variant="outlined"
                sx={{
                  aspectRatio: '16 / 9',
                  position: 'relative',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                <img className="h-full w-full" src={tool.icon} alt={tool.description} />
                <Typography
                  variant="h5"
                  sx={{
                    position: 'absolute',
                    bottom: 10,
                    width: '100%',
                    textAlign: 'center',
                  }}
                >
                  {tool.name}
                </Typography>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

Tools.getLayout = (page) => {
  return <UserLayout>{page}</UserLayout>;
};

export const getServerSideProps = () => {
  return {
    props: {
      meta: {
        title: 'Tools',
        description: 'Useful tools, such as video converter, swagger to code, etc.',
      },
    },
  };
};

export default Tools;
